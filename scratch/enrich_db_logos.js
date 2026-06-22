const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const ApplicationSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  company: String,
  role: String,
  logo: String,
  status: String,
}, { timestamps: true });

const Application = mongoose.models.Application || mongoose.model('Application', ApplicationSchema);

function isGenericCompany(companyName) {
  if (!companyName) return true;
  const name = companyName.toLowerCase().trim();
  const anonymousNames = ["confidential", "company", "anonymous", "not disclosed", "tbd", "employer", "various", "unknown"];
  return anonymousNames.some(word => name === word || name.includes(word));
}

function getCompanyDomain(company) {
  if (!company) return "";
  const cleanName = company
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

async function enrichDb() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected.');

    const apps = await Application.find({});
    console.log(`Checking ${apps.length} applications...`);

    for (const app of apps) {
      const logoVal = app.logo;
      const isLogoInvalid = !logoVal || logoVal === 'undefined' || logoVal === 'null' || logoVal.length === 1;

      if (isLogoInvalid && !isGenericCompany(app.company)) {
        let domain = '';
        try {
          const autocompleteUrl = `https://autocomplete.clearbit.com/v1/companies/suggest?query=${encodeURIComponent(app.company)}`;
          const res = await fetch(autocompleteUrl);
          if (res.ok) {
            const suggestions = await res.json();
            if (suggestions && suggestions.length > 0) {
              domain = suggestions[0].domain;
            }
          }
        } catch (err) {
          console.error(`Clearbit suggest autocomplete failed for ${app.company}:`, err);
        }

        if (!domain) {
          domain = getCompanyDomain(app.company);
        }

        if (domain) {
          const newLogo = `https://logos.hunter.io/${domain}`;
          console.log(`Updating "${app.company}" logo from "${logoVal}" to "${newLogo}"`);
          await Application.findByIdAndUpdate(app._id, { logo: newLogo });
        } else {
          const fallbackLogo = app.company ? app.company.charAt(0).toUpperCase() : 'C';
          console.log(`Setting "${app.company}" fallback logo to "${fallbackLogo}"`);
          await Application.findByIdAndUpdate(app._id, { logo: fallbackLogo });
        }
      } else if (!logoVal || logoVal === 'undefined' || logoVal === 'null') {
        const fallbackLogo = app.company ? app.company.charAt(0).toUpperCase() : 'C';
        console.log(`Setting "${app.company}" fallback logo to "${fallbackLogo}"`);
        await Application.findByIdAndUpdate(app._id, { logo: fallbackLogo });
      }
    }

    console.log('Done.');
    await mongoose.connection.close();
  } catch (err) {
    console.error(err);
  }
}

enrichDb();
