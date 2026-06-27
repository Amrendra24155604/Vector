import { NextResponse } from 'next/server';
import verifyAuth from '@/lib/auth-middleware';
import dbConnect from '@/lib/db-connect';
import Application from '@/models/Application';
import User from '@/models/User';
export { OPTIONS } from '@/lib/cors';

export async function POST(req) {
  try {
    const user = await verifyAuth(req);
    await dbConnect();

    const body = await req.json();
    const { company, role, location, status, link, notes, matchScore, salary, source, tags, contactName, contactEmail, logo } = body;
    if (!company || !role) {
      return NextResponse.json({ success: false, message: 'Company and role are required' }, { status: 400 });
    }

    const app = await Application.create({
      userId: user._id,
      company,
      role,
      location,
      status: status || 'Saved',
      appliedDate: status === 'Applied' ? new Date() : null,
      link,
      notes,
      matchScore,
      salary,
      source,
      tags,
      contactName,
      contactEmail,
      logo,
    });

    await User.findByIdAndUpdate(user._id, { $inc: { applicationsCount: 1 } });
    return NextResponse.json({ success: true, application: app }, { status: 201 });
  } catch (err) {
    const isAuthError = err.message && (err.message.includes('token') || err.message.includes('auth') || err.message.includes('found'));
    return NextResponse.json({ success: false, message: err.message }, { status: isAuthError ? 401 : 500 });
  }
}

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

export async function GET(req) {
  try {
    const user = await verifyAuth(req);
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const filter = { userId: user._id };
    if (status) filter.status = status;

    const apps = await Application.find(filter).sort('-updatedAt');

    const enrichedApps = await Promise.all(apps.map(async (app) => {
      const appObj = app.toObject();
      const logoVal = appObj.logo;
      const isLogoInvalid = !logoVal || logoVal === 'undefined' || logoVal === 'null' || logoVal.length === 1;

      if (isLogoInvalid && !isGenericCompany(appObj.company)) {
        let domain = '';
        try {
          const cleanedName = cleanCompanyName(appObj.company);
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
          console.error(`Clearbit suggest autocomplete failed for ${appObj.company} on GET:`, err);
        }

        if (!domain) {
          domain = getCompanyDomain(appObj.company);
        }

        if (domain) {
          appObj.logo = `https://logo.clearbit.com/${domain}`;
          await Application.findByIdAndUpdate(app._id, { logo: appObj.logo });
        } else {
          appObj.logo = appObj.company ? appObj.company.charAt(0).toUpperCase() : 'C';
        }
      } else if (!logoVal || logoVal === 'undefined' || logoVal === 'null') {
        appObj.logo = appObj.company ? appObj.company.charAt(0).toUpperCase() : 'C';
      }

      return appObj;
    }));

    return NextResponse.json({ success: true, applications: enrichedApps });
  } catch (err) {
    const isAuthError = err.message && (err.message.includes('token') || err.message.includes('auth') || err.message.includes('found'));
    return NextResponse.json({ success: false, message: err.message }, { status: isAuthError ? 401 : 500 });
  }
}

