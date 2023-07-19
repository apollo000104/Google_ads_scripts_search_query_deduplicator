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
* Single-Account-Version: Process Data Script (2/2)
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
  let accountId = AdsApp.currentAccount().getCustomerId();  
  let sheet = SpreadsheetApp.openById(sheetFileId).getSheetByName(accountId);
  let existingValues = readSheet(sheet);
  if ( existingValues ) {
    let filteredValues = existingValues.filter(e => e[10] === '');
    console.log("accountId: " + accountId + " // " + filteredValues.length + " terms to be processed for accountId " + accountId);
    let count = 0;
    for (i=0;i<filteredValues.length;i++) {
      count++;
      let status = checkForDuplicates(filteredValues[i],accountId);
      updateData(sheet,i+(existingValues.length-filteredValues.length),status);
      if ( count >= 1000 ) { console.log("accountId: " + accountId + " // Script terminated after " + count + " lines. Will continue with next scheduled run."); return; }
    }
  }
}

// FUNCTIONS

function checkForDuplicates(rowData,accountId){
    const query = '' +
          'SELECT ad_group_criterion.keyword.text,' +
          'ad_group_criterion.keyword.match_type, ' +
          'campaign.id, ' +
          'ad_group.id, ' +
          'campaign.status, ' +
          'ad_group.status, ' +
          'ad_group.type, ' +
          'ad_group_criterion.status, ' +
          'ad_group_criterion.negative, ' +
          'campaign.experiment_type ' +
          'FROM keyword_view ' + 
          'WHERE ad_group_criterion.keyword.text LIKE "' + rowData[0] + '" ' +
          'AND ad_group.id != ' + rowData[3] + ' ' +
          'AND campaign.status IN ("ENABLED") ' +
          'AND ad_group.status IN ("ENABLED") ' +
          'AND ad_group.type IN ("SEARCH_STANDARD") ' +
          'AND ad_group_criterion.status IN ("ENABLED") ' +
          'AND ad_group_criterion.negative = false ' +
          'AND campaign.experiment_type NOT IN ("DRAFT","EXPERIMENT") ' +
          '';
  let search = AdsApp.search(query);
  if (search.totalNumEntities() === 0){
    return 'Term skipped';
  } else {
    while (search.hasNext()){
      var row = search.next();
      if ( row.campaign.id === rowData[2].toString()) {
        if ( createAdGroupNegative(rowData[0],rowData[3]) === 1 ) {
          return 'AdGroup Negative added';
          break;
        } else {
          return 'AdGroup Negative skipped';
        }
      } else if ( row.campaign.id != rowData[2].toString() ) {
        if ( createCampaignNegative(rowData[0],rowData[2]) === 1 ) {
          return 'Campaign Negative added';
          break;
        } else {
          return 'Campaign Negative skipped';
        }
      } else {
        return 'Comparison failed';
      }
    }
  }
}

function createCampaignNegative(term,campaign){
  let newNegative = "[" + term + "]";
  let campaignSelector = AdsApp.campaigns().withIds([campaign])
  let campaignIterator = campaignSelector.get();
  while (campaignIterator.hasNext()) {
    let campaign = campaignIterator.next();
    let campaignNegatives = campaign.negativeKeywords().get();
    let checkNegatives = 0;
    while (campaignNegatives.hasNext()) {
      var negativeKeyword = campaignNegatives.next();
      if ( negativeKeyword.getText() === newNegative ) {
        checkNegatives = 1;
        break;
      }   
    }
    if ( checkNegatives === 0 ) {
      campaign.createNegativeKeyword(newNegative);
      return 1;
    } else {
      return 0;
    }
  }
}

function createAdGroupNegative(term,adgroup){
  let newNegative = "[" + term + "]";
  let adgroupSelector = AdsApp.adGroups().withIds([adgroup])
  let adgroupIterator = adgroupSelector.get();
  while (adgroupIterator.hasNext()) {
    let adgroup = adgroupIterator.next();
    let adgroupNegatives = adgroup.negativeKeywords().get();
    let checkNegatives = 0;
    while (adgroupNegatives.hasNext()) {
      var negativeKeyword = adgroupNegatives.next();
      if ( negativeKeyword.getText() === newNegative ) {
        checkNegatives = 1;
        break;
      }   
    }
    if ( checkNegatives === 0 ) {
      adgroup.createNegativeKeyword(newNegative);
      return 1;
    } else {
      return 0;
    }
  }
}

function readSheet(sheet){
  let lastRow = sheet.getLastRow();
  let lastColumn = sheet.getLastColumn();
  if (lastRow === 1) {
    return 0;
  } else {
    return sheet.getRange(2,1,lastRow-1,lastColumn).getValues();
  }
}

function updateData(sheet,index,status){
  sheet.getRange(index + 2, 11).setValue(status);
}
