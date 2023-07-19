/*           _ _              __  __ _      
*   __ _  __| | |_ _ __ __ _ / _|/ _(_) ___ 
*  / _` |/ _` | __| '__/ _` | |_| |_| |/ __|
* | (_| | (_| | |_| | | (_| |  _|  _| | (__ 
*  \__,_|\__,_|\__|_|  \__,_|_| |_| |_|\___|
* 
* E: info@adtraffic.de | W: www.adtraffic.de
* 
* Search Query Deduplicator 22.1
* 
* Single-Account-Version: Prepare Data Script (1/2)
* 
* @desc: Use this Google Ads Script to identify all
* search terms that do not match in the intended ad
* group and automatically exclude them.
* 
* @author: @ric_sti (Twitter)
* @version: 1.0
* @github-slug: google-ads-scripts-search-query-deduplicator
* 
*/

const sheetFileId = '{{Search Query Deduplicator Google Sheet ID}}';

function main() {
  const accountId = AdsApp.currentAccount().getCustomerId();  
  const ocid = '{{ocid}}';
  
  let sheetStatus = prepareSheet(sheetFileId,accountId);
  let activeSearchTerms = getActiveSearchTerms(ocid);

  writeData(activeSearchTerms,sheetFileId,accountId)
}

// FUNCTIONS

function prepareSheet(sheetFileId,accountId){
  var ss = SpreadsheetApp.openById(sheetFileId);
  if (!ss.getSheetByName(accountId)){
    let templateSheet = ss.getSheetByName('templateSheet');
    ss.insertSheet(accountId, {template: templateSheet});
    return 2;
  } else {
    let sh = ss.getSheetByName(accountId);
    let lastRow = sh.getLastRow();
    let lastColumn = sh.getLastColumn();
    sh.getRange(2, 1, lastRow, lastColumn).clear();
    return 1;
  }
}

function getActiveSearchTerms(ocid){
  var activeSearchTerms = [];
  const query = 'SELECT search_term_view.search_term,segments.search_term_match_type,metrics.impressions,metrics.clicks,metrics.conversions,campaign.id,campaign.name,ad_group.id,ad_group.name,ad_group.type FROM search_term_view WHERE campaign.status IN ("ENABLED") AND ad_group.status IN ("ENABLED") AND ad_group.type IN ("SEARCH_STANDARD") AND segments.search_term_match_type NOT IN ("EXACT","NEAR_EXACT") AND metrics.impressions > 30 AND segments.date DURING LAST_30_DAYS ORDER BY metrics.impressions DESC'
  let search = AdsApp.search(query);
  while (search.hasNext()) {
    let row = search.next();
    let googleAdsDeeplink = '';
    if (ocid.length > 0) {
      googleAdsDeeplink = 'https://ads.google.com/aw/keywords/searchterms?campaignId='+row.campaign.id+'&adGroupId='+row.adGroup.id+'&ocid=' + ocid;
    }
    activeSearchTerms.push([
      row.searchTermView.searchTerm,
      row.segments.searchTermMatchType,
      row.campaign.id,
      row.adGroup.id,
      row.campaign.name,
      row.adGroup.name,
      googleAdsDeeplink,
      row.metrics.impressions,
      row.metrics.clicks,
      row.metrics.conversions
    ]);
  }
  return activeSearchTerms;  
}

  function writeData(data,sheetFileId,sheetName){
  if (data.length === 0) { return; }
  var sheet = SpreadsheetApp.openById(sheetFileId).getSheetByName(sheetName);
  sheet.getRange(2, 1, data.length, data[0].length).setValues(data);
}
