export function getEbayApiBase() {
  const apiUri = process.env.EBAY_API_URI;
  if (!apiUri) throw new Error("EBAY_API_URI is not set");
  return apiUri.replace(/\/+$/, ""); // trim trailing slash
}

export function getEbayClientCreds() {
  const clientId = process.env.EBAY_CLIENT_ID;
  const clientSecret = process.env.EBAY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("EBAY_CLIENT_ID/EBAY_CLIENT_SECRET not set");
  }
  return { clientId, clientSecret };
}

export function getEbayRuName() {
  const ruName = process.env.EBAY_RU_NAME;
  if (!ruName) throw new Error("EBAY_RU_NAME not set");
  return ruName;
}
