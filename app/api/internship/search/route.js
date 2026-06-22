import { NextResponse } from 'next/server';
import verifyAuth from '@/lib/auth-middleware';
import dbConnect from '@/lib/db-connect';
import { runPythonAgent } from '@/lib/python-runner';
import { ChatOpenAI } from "@langchain/openai";
import fs from 'fs';
import path from 'path';

function cleanCompanyName(company) {
  if (!company) return "";
  let clean = company;
  // Remove content in brackets or parentheses
  clean = clean.replace(/\s*\([^)]*\)/g, "");
  clean = clean.replace(/\s*\[[^\]]*\]/g, "");

  // Split by common separators and take the first part
  const separators = [" - ", " | ", " / ", ", ", " – "];
  for (const sep of separators) {
    if (clean.includes(sep)) {
      clean = clean.split(sep)[0];
    }
  }

  return clean.trim();
}

function isGenericCompany(companyName) {
  if (!companyName) return true;
  const name = cleanCompanyName(companyName).toLowerCase();
  const anonymousNames = ["confidential", "company", "anonymous", "not disclosed", "tbd", "employer", "various", "unknown"];
  return anonymousNames.some(word => name === word || name.includes(word));
}

function getCompanyDomain(company) {
  if (!company) return "";
  const cleaned = cleanCompanyName(company);
  const cleanName = cleaned
    .toLowerCase()
    .replace(/\b(inc|corp|co|corporation|llc|ltd|limited|group|holdings|solutions|systems|technologies|technology|labs|software|services|global|usa|us|uk|india|digital|partners|capital|advisors)\b\.?/gi, "")
    .trim();
  
  const domainWord = cleanName.replace(/[^a-z0-9]/gi, "");
  if (!domainWord) return "";
  
  const customMappings = {
    google: "google.com",
    microsoft: "microsoft.com",
    apple: "apple.com",
    meta: "meta.com",
    facebook: "meta.com",
    amazon: "amazon.com",
    netflix: "netflix.com",
    twitter: "twitter.com",
    uber: "uber.com",
    lyft: "lyft.com",
    airbnb: "airbnb.com",
    stripe: "stripe.com",
    coinbase: "coinbase.com",
    roblox: "roblox.com",
    linkedin: "linkedin.com",
    salesforce: "salesforce.com",
    slack: "slack.com",
    adobe: "adobe.com",
    tesla: "tesla.com",
    nvidia: "nvidia.com",
    tiktok: "tiktok.com",
    bytedance: "bytedance.com",
    spotify: "spotify.com",
    intel: "intel.com",
    ibm: "ibm.com",
    oracle: "oracle.com",
    cisco: "cisco.com",
    github: "github.com",
    gitlab: "gitlab.com",
    figma: "figma.com",
    atlassian: "atlassian.com",
    zoom: "zoom.us",
    openai: "openai.com",
    anthropic: "anthropic.com",
    palantir: "palantir.com",
    snowflake: "snowflake.com",
    databricks: "databricks.com",
    pinterest: "pinterest.com",
    snap: "snap.com",
    reddit: "reddit.com",
    ebay: "ebay.com",
    paypal: "paypal.com",
    shopify: "shopify.com",
    squarespace: "squarespace.com",
    wix: "wix.com",
    canva: "canva.com",
    notion: "notion.so",
    slackhq: "slack.com",
    trello: "trello.com",
    asana: "asana.com",
    monday: "monday.com",
    zoomvideo: "zoom.us",
    ciscointegrated: "cisco.com",
    hewlettpackard: "hp.com",
    hp: "hp.com",
    dell: "dell.com",
    lenovo: "lenovo.com",
    samsung: "samsung.com",
    sony: "sony.com",
    lg: "lg.com",
    panasonic: "panasonic.com",
    philips: "philips.com",
    siemens: "siemens.com",
    bosch: "bosch.com",
    accenture: "accenture.com",
    deloitte: "deloitte.com",
    pwc: "pwc.com",
    ey: "ey.com",
    kpmg: "kpmg.com",
    mckinsey: "mckinsey.com",
    bcg: "bcg.com",
    bain: "bain.com",
    goldmansachs: "goldmansachs.com",
    morganstanley: "morganstanley.com",
    jpmorgan: "jpmorgan.com",
    jpmorganchase: "jpmorganchase.com",
    chase: "chase.com",
    citibank: "citigroup.com",
    citi: "citigroup.com",
    bankofamerica: "bankofamerica.com",
    wellsfargo: "wellsfargo.com",
    americanexpress: "americanexpress.com",
    visa: "visa.com",
    mastercard: "mastercard.com",
    capitalone: "capitalone.com",
    fidelity: "fidelity.com",
    vanguard: "vanguard.com",
    blackrock: "blackrock.com",
    spacex: "spacex.com",
    nasa: "nasa.gov",
    lockheedmartin: "lockheedmartin.com",
    boeing: "boeing.com",
    northropgrumman: "northropgrumman.com",
    raytheon: "rtx.com",
    generalmotors: "gm.com",
    ford: "ford.com",
    toyota: "toyota.com",
    honda: "honda.com",
    bmw: "bmw.com",
    mercedesbenz: "mercedes-benz.com",
    audi: "audi.com",
    volkswagen: "volkswagen.com",
    walmart: "walmart.com",
    target: "target.com",
    costco: "costco.com",
    starbucks: "starbucks.com",
    mcdonards: "mcdonalds.com",
    nike: "nike.com",
    adidas: "adidas.com",
  };

  if (customMappings[domainWord]) {
    return customMappings[domainWord];
  }
  
  return `${domainWord}.com`;
}

async function getAdzunaCountry(locationText) {
  if (!locationText) return 'us';
  const text = locationText.toLowerCase().trim();
  const words = text.split(/[^a-z0-9]+/).filter(Boolean);

  const hasAnyWord = (list) => list.some(w => words.includes(w));

  // 1. Local patterns first to avoid API call where possible
  if (
    hasAnyWord([
      'india', 'in', 'bangalore', 'bengaluru', 'delhi', 'mumbai', 'hyderabad', 'pune',
      'chennai', 'noida', 'gurgaon', 'kolkata', 'gorakhpur', 'lucknow', 'jaipur',
      'patna', 'ahmedabad', 'surat', 'coimbatore', 'kochi', 'indore', 'bhopal',
      'chandigarh', 'bhubaneswar', 'thiruvananthapuram'
    ])
  ) {
    return 'in';
  }
  if (
    hasAnyWord([
      'united kingdom', 'uk', 'gb', 'london', 'manchester', 'birmingham', 'leeds',
      'glasgow', 'edinburgh', 'liverpool', 'bristol', 'sheffield'
    ]) || text.includes('united kingdom')
  ) {
    return 'gb';
  }
  if (
    hasAnyWord([
      'canada', 'ca', 'toronto', 'vancouver', 'montreal', 'ottawa', 'waterloo',
      'calgary', 'edmonton', 'mississauga'
    ])
  ) {
    return 'ca';
  }
  if (
    hasAnyWord([
      'australia', 'au', 'sydney', 'melbourne', 'brisbane', 'perth', 'adelaide', 'canberra'
    ])
  ) {
    return 'au';
  }
  if (
    hasAnyWord([
      'germany', 'de', 'berlin', 'munich', 'frankfurt', 'hamburg', 'cologne', 'stuttgart', 'dusseldorf'
    ])
  ) {
    return 'de';
  }
  if (
    hasAnyWord([
      'france', 'fr', 'paris', 'lyon', 'toulouse', 'marseille', 'nice', 'nantes'
    ])
  ) {
    return 'fr';
  }
  if (hasAnyWord(['singapore', 'sg'])) {
    return 'sg';
  }
  if (
    hasAnyWord([
      'netherlands', 'nl', 'amsterdam', 'rotterdam', 'hague', 'utrecht'
    ])
  ) {
    return 'nl';
  }
  if (
    hasAnyWord([
      'new zealand', 'nz', 'auckland', 'wellington', 'christchurch'
    ]) || text.includes('new zealand')
  ) {
    return 'nz';
  }
  if (
    hasAnyWord([
      'brazil', 'br', 'sao paulo', 'rio de janeiro', 'brasilia'
    ]) || text.includes('sao paulo') || text.includes('rio de janeiro')
  ) {
    return 'br';
  }
  if (
    hasAnyWord([
      'spain', 'es', 'madrid', 'barcelona', 'valencia', 'seville'
    ])
  ) {
    return 'es';
  }
  if (
    hasAnyWord([
      'italy', 'it', 'rome', 'milan', 'naples', 'turin', 'florence'
    ])
  ) {
    return 'it';
  }
  if (
    hasAnyWord([
      'austria', 'at', 'vienna', 'salzburg', 'graz'
    ])
  ) {
    return 'at';
  }
  if (
    hasAnyWord([
      'russia', 'ru', 'moscow', 'saint petersburg'
    ]) || text.includes('saint petersburg')
  ) {
    return 'ru';
  }
  if (
    hasAnyWord([
      'poland', 'pl', 'warsaw', 'krakow', 'wroclaw'
    ])
  ) {
    return 'pl';
  }
  if (
    hasAnyWord([
      'south africa', 'za', 'johannesburg', 'cape town', 'durban', 'pretoria'
    ]) || text.includes('south africa') || text.includes('cape town')
  ) {
    return 'za';
  }
  if (
    hasAnyWord([
      'usa', 'united states', 'us', 'new york', 'nyc', 'san francisco', 'sf',
      'los angeles', 'la', 'chicago', 'boston', 'seattle', 'austin', 'silicon valley'
    ]) || text.includes('united states') || text.includes('new york') || text.includes('san francisco') || text.includes('los angeles') || text.includes('silicon valley')
  ) {
    return 'us';
  }

  // 2. If no local patterns match, call OpenAI to determine the 2-letter country code
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return 'us';

  try {
    const model = new ChatOpenAI({
      modelName: "gpt-4o-mini",
      temperature: 0,
      openAIApiKey: apiKey,
      maxTokens: 5
    });

    const systemInstruction = `You are a helper that resolves locations to Adzuna country codes.
Supported country codes: us, gb, ca, au, de, fr, sg, nl, nz, br, es, it, in, at, ru, pl, za.
Given a location, respond with ONLY the best matching 2-letter country code. 
If the location is not in any of these countries, return "us". 
If the location is remote or unspecified, return "us".`;

    const response = await model.invoke([
      { role: "system", content: systemInstruction },
      { role: "user", content: `Location: "${locationText}"` }
    ]);

    const code = response.content.trim().toLowerCase();
    const validCodes = ['us', 'gb', 'ca', 'au', 'de', 'fr', 'sg', 'nl', 'nz', 'br', 'es', 'it', 'in', 'at', 'ru', 'pl', 'za'];
    if (validCodes.includes(code)) {
      return code;
    }
  } catch (err) {
    console.error("Failed to resolve country with LLM:", err);
  }

  return 'us';
}


export async function POST(req) {
  try {
    // Authenticate request using verifyAuth middleware
    const user = await verifyAuth(req);
    await dbConnect();

    const body = await req.json();
    const { skills, major, location, interests } = body;

    const appId = process.env.ADZUNA_APP_ID || 'c17a1506';
    const appKey = process.env.ADZUNA_APP_KEY || '4e6536100ea9d05eff120e70bbb9620c';

    if (!appId || !appKey) {
      return NextResponse.json(
        { success: false, message: 'Adzuna API credentials not configured on the server.' },
        { status: 500 }
      );
    }

    // Determine query keywords dynamically based on profile parameters (picking one primary term to keep query successful)
    let queryWhat = '';

    if (skills) {
      const firstSkill = skills.split(',')[0].trim().replace(/\.+$/, '');
      if (firstSkill) {
        queryWhat = firstSkill;
      }
    }

    if (!queryWhat && major) {
      const firstMajor = major.split(',')[0].trim().replace(/\.+$/, '');
      if (firstMajor) {
        queryWhat = firstMajor;
      }
    }

    if (!queryWhat && interests) {
      const firstInterest = interests.split(',')[0].trim().replace(/\.+$/, '');
      if (firstInterest) {
        queryWhat = firstInterest;
      }
    }

    if (!queryWhat) {
      queryWhat = 'Software Engineer';
    }

    // Append 'intern' if not already present
    if (!queryWhat.toLowerCase().includes('intern')) {
      queryWhat += ' intern';
    }

    let queryWhere = '';
    let isRemote = false;

    if (location) {
      const locClean = location.trim();
      if (locClean.toLowerCase().includes('remote')) {
        isRemote = true;
        // Extract parts of location other than "remote" (e.g., "Remote, New York" -> "New York")
        const parts = locClean
          .split(',')
          .map(p => p.trim())
          .filter(p => !p.toLowerCase().includes('remote'));
        if (parts.length > 0) {
          queryWhere = parts.join(', ');
        }
      } else {
        queryWhere = locClean;
      }
    }

    if (isRemote && !queryWhat.toLowerCase().includes('remote')) {
      queryWhat += ' remote';
    }

    // Call Adzuna search endpoint based on dynamic country mapping
    const country = await getAdzunaCountry(location);
    const page = 1;
    let adzunaUrl = `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}?app_id=${appId}&app_key=${appKey}&results_per_page=15`;

    adzunaUrl += `&what=${encodeURIComponent(queryWhat)}`;
    if (queryWhere) {
      adzunaUrl += `&where=${encodeURIComponent(queryWhere)}`;
    }

    const response = await fetch(adzunaUrl, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { success: false, message: `Adzuna API Error: ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const results = data.results || [];

    // Map Adzuna results to our Internship format with parallel Clearbit autocomplete calls
    const matchesPromises = results.map(async (job, index) => {
      const companyName = job.company?.display_name || 'Company';
      
      // Attempt to find canonical domain using Clearbit suggest API
      let domain = '';
      if (!isGenericCompany(companyName)) {
        try {
          const cleanedName = cleanCompanyName(companyName);
          const cleanQuery = cleanedName
            .replace(/\b(inc|corp|co|corporation|llc|ltd|limited|group|holdings|solutions|systems|technologies|technology|labs|software|services|global|usa|us|uk|india|digital|partners|capital|advisors)\b\.?/gi, "")
            .replace(/[^a-zA-Z0-9\s]/g, "")
            .trim();
          const autocompleteUrl = `https://autocomplete.clearbit.com/v1/companies/suggest?query=${encodeURIComponent(cleanQuery)}`;
          const res = await fetch(autocompleteUrl);
          if (res.ok) {
            const suggestions = await res.json();
            if (suggestions && suggestions.length > 0) {
              domain = suggestions[0].domain;
            }
          }
        } catch (err) {
          console.error(`Clearbit suggest autocomplete failed for ${companyName}:`, err);
        }

        // Fallback to local regex-based parsing if suggest returns nothing or fails
        if (!domain) {
          domain = getCompanyDomain(companyName);
        }
      }

      const logo = domain ? `https://logo.clearbit.com/${domain}` : companyName.charAt(0).toUpperCase();

      // Extract relevant tags
      const description = (job.description || '').toLowerCase();
      const title = (job.title || '').toLowerCase();
      const possibleTags = ['React', 'Node.js', 'Python', 'TypeScript', 'SQL', 'GraphQL', 'Machine Learning', 'API', 'Frontend', 'Backend', 'Full Stack', 'Cloud', 'Docker', 'AWS'];
      const tags = [];
      possibleTags.forEach(t => {
        if (description.includes(t.toLowerCase()) || title.includes(t.toLowerCase())) {
          tags.push(t);
        }
      });

      if (tags.length === 0) {
        if (job.category && job.category.label) {
          tags.push(job.category.label.replace(' Jobs', ''));
        } else {
          tags.push('Software');
        }
      }

      return {
        id: job.id || `adz-${index}`,
        company: companyName,
        role: job.title || 'SWE Intern',
        location: job.location?.display_name || 'US',
        match: 75,
        status: 'None',
        reason: '',
        tags: tags.slice(0, 3),
        logo: logo,
        link: job.redirect_url || '',
        description: job.description || ''
      };
    });

    const matches = await Promise.all(matchesPromises);
    let finalMatches = matches;
    try {
      // Run Python AI Agent to determine custom 'Why this fits' reasons dynamically
      const agentResult = await runPythonAgent('internship_fit_agent.py', {
        profile: { skills, major, location, interests },
        jobs: matches.map(m => ({
          id: m.id,
          company: m.company,
          role: m.role,
          description: m.description
        }))
      });

      if (agentResult && agentResult.reasons) {
        const reasonsMap = {};
        agentResult.reasons.forEach(r => {
          reasonsMap[r.id] = r.reason;
        });

        // Merge AI-generated reasons and compute dynamic match scores
        finalMatches = matches.map(m => {
          let matchScore = 70;
          const description = m.description.toLowerCase();
          const title = m.role.toLowerCase();

          let matchedSkills = [];
          if (skills) {
            const skillsList = skills.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
            skillsList.forEach(skill => {
              if (description.includes(skill) || title.includes(skill)) {
                matchedSkills.push(skill);
                matchScore += 8;
              }
            });
          }
          if (interests) {
            const interestsList = interests.split(',').map(i => i.trim().toLowerCase()).filter(Boolean);
            interestsList.forEach(interest => {
              if (description.includes(interest) || title.includes(interest)) {
                matchScore += 4;
              }
            });
          }
          matchScore = Math.min(99, Math.max(60, matchScore));

          const mapped = {
            ...m,
            match: matchScore,
            reason: reasonsMap[m.id] || `Matches your interest in ${m.role} at ${m.company}.`
          };
          delete mapped.description; // Remove description context before returning to UI
          return mapped;
        });
      }
    } catch (err) {
      console.error('Failed to run internship fit Python agent:', err);
      // Write error to debug_search.log for inspection
      try {
        fs.appendFileSync(
          path.join(process.cwd(), 'debug_search.log'),
          `[${new Date().toISOString()}] Error: ${err.message}\nStack: ${err.stack}\n`
        );
      } catch (logErr) {
        console.error('Failed to write debug log:', logErr);
      }

      // Fallback: Generate local reason strings so search never fails for users
      finalMatches = matches.map(m => {
        let matchScore = 70;
        const description = m.description.toLowerCase();
        const title = m.role.toLowerCase();

        let matchedSkills = [];
        if (skills) {
          const skillsList = skills.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
          skillsList.forEach(skill => {
            if (description.includes(skill) || title.includes(skill)) {
              matchedSkills.push(skill);
              matchScore += 8;
            }
          });
        }
        if (interests) {
          const interestsList = interests.split(',').map(i => i.trim().toLowerCase()).filter(Boolean);
          interestsList.forEach(interest => {
            if (description.includes(interest) || title.includes(interest)) {
              matchScore += 4;
            }
          });
        }
        matchScore = Math.min(99, Math.max(60, matchScore));

        let reason = `This role fits your background in ${major || 'technology'}.`;
        if (matchedSkills.length > 0) {
          reason = `Your skills in ${matchedSkills.join(', ')} align with this team's requirement.`;
        }

        const mapped = {
          ...m,
          match: matchScore,
          reason: reason
        };
        delete mapped.description;
        return mapped;
      });
    }

    return NextResponse.json({ success: true, results: finalMatches });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
