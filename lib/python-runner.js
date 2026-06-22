/**
 * runPythonAgent — spawn a Python script as a subprocess,
 * pass inputData as JSON via stdin, parse JSON from stdout.
 *
 * @param {string} scriptName  filename inside the /agents/ folder
 * @param {object} inputData   plain object serialized to JSON on stdin
 * @param {number} timeoutMs   max ms to wait (default 35s)
 * @returns {Promise<object>}  parsed JSON output from the Python script
 */
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// agents/ lives at <project-root>/agents/, lib/ lives at <project-root>/lib/
const AGENTS_DIR = path.resolve(__dirname, '..', 'agents');

// Try python3 first (Linux/Mac), then python (Windows), then explicit paths
const PYTHON_CANDIDATES = process.platform === 'win32'
  ? ['python', 'python3', 'C:\\Python313\\python.exe', 'C:\\Python312\\python.exe']
  : ['python3', 'python'];

function findPython() {
  for (const cmd of PYTHON_CANDIDATES) {
    try {
      if (process.platform === 'win32') {
        execSync(`where ${cmd}`, { stdio: 'ignore' });
      } else {
        execSync(`which ${cmd}`, { stdio: 'ignore' });
      }
      return cmd;
    } catch {
      continue;
    }
  }
  return PYTHON_CANDIDATES[0];
}

const PYTHON_CMD = findPython();

export function runPythonAgent(scriptName, inputData, timeoutMs = 35000) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(AGENTS_DIR, scriptName);

    const child = spawn(PYTHON_CMD, [scriptPath], {
      env: { ...process.env }, // inherit all env vars including OPENAI_API_KEY
    });

    let stdout = '';
    let stderr = '';

    const timer = setTimeout(() => {
      child.kill('SIGTERM');
      reject(new Error(`Python agent "${scriptName}" timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    child.stdin.on('error', () => {}); // suppress EPIPE if process exits early
    child.stdin.write(JSON.stringify(inputData));
    child.stdin.end();

    child.stdout.on('data', (chunk) => { stdout += chunk.toString(); });
    child.stderr.on('data', (chunk) => { stderr += chunk.toString(); });

    child.on('close', (code) => {
      clearTimeout(timer);
      if (code === 0) {
        try {
          resolve(JSON.parse(stdout.trim()));
        } catch {
          reject(new Error(`Agent returned invalid JSON: ${stdout.slice(0, 300)}`));
        }
      } else {
        reject(new Error(`Agent exited with code ${code}: ${stderr.slice(0, 500)}`));
      }
    });

    child.on('error', (err) => {
      clearTimeout(timer);
      reject(new Error(`Failed to spawn Python: ${err.message}`));
    });
  });
}
