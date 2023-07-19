<a href id="top"></a>
# Google Ads Script Search Query Deduplicator 22.1 - ENGLISH
## Description
Use this Google Ads Script to identify all search terms that do not match in the intended ad group and automatically exclude them.

## Overview
* <a href="#installation">Installation</a>
* <a href="#execution">First execution & overview of the columns in the sheet</a>
* <a href="#planning">Planning / regular execution</a>
* <a href="#functions">Function descriptions</a>
* <a href="#parameters">Function parameters</a>

---
<a id="installation"></a>

## Installation

### I. Set up Google Ads scripts

Open your Google Ads account or MCC and navigate to "Tools and Settings > Bulk Actions > Scripts".

The Search Query Duplicator is divided into two scripts.

#### <strong>Script 1 - "SQ Deduplicator 22.1 Prepare Data"</strong>
The first script prepares the data for further processing and writes it to a Google Sheet.

<u><i>Setup:</i></u>

Create a new Google Ads script <i>(suggested name: "SQ Deduplicator 22.1 Prepare Data")</i> and overwrite the content with the appropriate code template:

* Single account: single_account_prepare_data.js
* MCC version: mcc_version_prepare_data.js

#### <strong>Script 2 - "SQ Deduplicator 22.1 Process Data"</strong>
The second script processes the unprocessed rows from the Google Sheet and writes the processing status back to the respective data row.

<u><i>Setup:</i></u>

Create a new Google Ads script <i>(suggested name: "SQ Deduplicator 22.1 Process Data")</i> and overwrite the content with the appropriate code template:

* Single account: single_account_process_data.js
* MCC version: mcc_version_process_data.js

### II. Create Google Sheet from template

A Google Sheet is used for the temporary storage and further processing of the search terms. You can copy the template with the following Google Drive link: <a href="https://docs.google.com/spreadsheets/d/1OARjoIsFVciGIxbvuwmjV6Wdflg1kDangp8s_R3LV10/copy" target="_blank">adtraffic Search Query Deduplicator Google Sheet Template</a>

Paste the ID of your newly created Google Sheet into both scripts at the position of "{{Search Query Deduplicator Google Sheet ID}}".

<a id="installIII"></a>

### III Provide BatchService Response (MCC) resp. "ocid"-Parameter (Single Account) _[optional]_

In order to generate direct links to the Google Ads ad groups, the "ocid" parameter for the respective Google Ads account is required.

#### <u>III.a Google Ads "BatchService Response" (for MCC Version)</u>

The "ocid" parameter can be read from the response of the BatchService at MCC level for all child accounts. To make the response available as an object in the script, proceed as follows:

1. Open the relevant MCC and navigate to "Accounts > Performance"
2. Open the browser's developer tools and select the "Network" tab
3. Reload the page and filter the entries with "batch account"
4. Click on the entry that starts with "Batch?authuser=" and select "Response" on the right
5. Copy the entire content of the response and paste it in <u>Script 1 - "SQ Deduplicator 22.1 Prepare Data"</u> at the porsition of "{{BatchService Response}}".

<strong>Alternatively:</strong>
<p>Remove the placeholder "{{BatchService Response}}", leaving the following content in the line:</p>
<code>let batchAccountSnippet = new Object();</code>
---

#### <u>III.b Provide Google Ads "ocid" parameter (for single accounts)</u>

For single accounts, the "ocid" parameter can be read from the address bar.

1. Log in to the relevant Google Ads account and copy the digits after "ocid=" from your browser's address bar
2. Paste the copied digits into <u>Script 1 - "SQ Deduplicator 22.1 Prepare Data"</u> at the postion of "{{ocid}}".

<strong>Alternatively:</strong>
<p>Remove the placeholder "{{ocid}}", leaving the following content in the line:</p>
<code>const ocid = '';</code>
---

### _[optional]_ IV. Define Account IDs (for MCC version)

Add the Account IDs of the accounts to be processed as comma-separated strings in both scripts at the postion of "{{Account IDs Array}}".

<u><i>Example syntax:</i></u>
<code>'123-456-7890','456-123-7890','654-321-7890','321-654-7890'</code>

<strong>Alternatively:</strong>
<p>Remove the placeholder "Account IDs Array", leaving the following content in the line:</p>
<code>let accountIds = [];</code>

---

<a id="execution"></a>

## First execution & overview of the columns in the sheet
<a href="#top"><button style="float:right;margin-top:-2.2em;">back to top</button></a>

When the <u>Script 1 - "SQ Deduplicator 22.1 Prepare Data"</u> is executed for the first time, a new worksheet with the respective account ID as the worksheet name with eleven columns is created in the Google Sheet for each processed account:

* searchTerm
* matchType
* campaignId 
* adgroupId 
* campaignName
* adGroupName
* deepLink
* impressions
* clicks
* conversions
* processed

The first six columns are self-explanatory.

The "deepLink" column contains a direct link to the ad group of the respective search term (if the "ocid" parameter is available - see <a href="#installIII">Install Step III</a>). The "impressions", "clicks" and "conversions" columns contain the respective values ​​for the queried period (by default the last 30 days).

The last column "processed" can contain six different return values ​​after executing the <u>Script 2 - "SQ Deduplicator 22.1 Process Data"</u>:

<a id="returnvalues"></a>

### Return values ​​from Script 2
<a href="#top"><button style="float:right;margin-top:-2.2em;">back to top</button></a>

| Value | Meaning |
| --- | --- |
| Term&nbsp;skipped | The search term does not match an actively booked keyword in the account. No negative keyword was created.
| Campaign&nbsp;Negative&nbsp;added | The search term corresponds to an actively booked keyword in another campaign. A negative keyword was created in the campaign of the found search term. (*)
| Campaign&nbsp;Negative&nbsp;skipped | The search term corresponds to an actively booked keyword in another campaign. However, no negative keyword was created in the campaign of the found search term because a corresponding negative keyword was already booked there.
| AdGroup&nbsp;Negative&nbsp;added | The search term matches an actively booked keyword in another ad group in the same campaign. A negative keyword was created in the ad group of the found search term. (*)
| AdGroup&nbsp;Negative&nbsp;skipped | The search term matches an actively booked keyword in another ad group in the same campaign. However, no negative keyword was created in the ad group of the found search term because a corresponding negative keyword was already booked there.
| Comparison&nbsp;failed | At least one duplicate was found when processing the data from the sheet, but an error occurred when matching the campaignId.

(*) Running the script in preview mode will <strong><u>not</u></strong> create negative keywords. In the script editor under "Changes" you can see in which campaigns or ad groups negative keywords <strong><u>would</u></strong> be booked.

---

<a id="planning"></a>

## Planning / regular execution
<a href="#top"><button style="float:right;margin-top:-2.2em;">back to top</button></a>

By executing the <u>Script 1 - "SQ Deduplicator 22.1 Prepare Data"</u> all data in the Google Sheet will be overwritten. Running the script weekly should be sufficient for most accounts. For large accounts with several hundred newly identified search queries every day, daily execution makes perfect sense.

The <u>Script 2 - "SQ Deduplicator 22.1 Process Data"</u> only processes rows without a value in the "processed" column. A limit for the maximum number of lines to be processed can be defined (default: 1,000 lines) so that the script does not run into a timeout when processing a very large number of search terms. Script 2 should be planned to run enough times to process all of the identified search terms.

---

<a id="functions"></a>

## Function descriptions
<a href="#top"><button style="float:right;margin-top:-2.2em;">back to top</button></a>

### Script 1 - "SQ Deduplicator 22.1 Prepare Data"

<dl>
<dt><a href="#main1">main()</a> ⇒</dt>
<dd><p>MCC version: Loads the accounts to be processed and starts the parallel execution of the script.</p>
<p>Single account version: Basically the same as the MCC function <a href="#processAccount1">processAccount()</a></p>
</dd>
</dl>
<dl>
<dt><a href="#processAccount1">processAccount()</a> ⇒</dt>
<dd><p>Runs the Google Sheet preparation, then loads the active search terms and initiates the export of the aggregated search terms to the Google Sheet.</p>
</dd>
</dl>
<dl>
<dt><a href="#prepareSheet">prepareSheet()</a> ⇒</dt>
<dd><p>Creates a new sheet for the account to be processed in the Google Sheet or deletes the data it contains if a sheet already exists for the respective account.</p>
</dd>
</dl>
<dl>
<dt><a href="#getActiveSearchTerms">getActiveSearchTerms()</a> ⇒</dt>
<dd><p>Retrieves all search terms that did <u><strong>not</strong></u> match with EXACT or NEAR EXACT match type and generated a minimum number of impressions (30 by default) in the given time period (30 days by default).</p>
</dd>
</dl>
<dl>
<dt><a href="#writeData">writeData()</a> ⇒</dt>
<dd><p>Writes the prepared data to the Google Sheet.</p>
</dd>
</dl>

---

### Script 2 - "SQ Deduplicator 22.1 Process Data"
<a href="#top"><button style="float:right;margin-top:-2.2em;">back to top</button></a>

<dl>
<dt><a href="#main2">main()</a> ⇒</dt>
<dd><p>MCC version: Loads the accounts to be processed and starts the parallel execution of the script.</p>
<p>Single account version: Basically the same as the MCC function <a href="#processAccount2">processAccount()</a></p>
</dd>
</dl>
<dl>
<dt><a href="#processAccount2">processAccount()</a> ⇒</dt>
<dd><p>Runs the Google Sheet preparation, then loads the active search terms and starts writing the aggregated search terms to the Google Sheet.</p>
</dd>
</dl>
<dl>
<dt><a href="#checkForDuplicates">checkForDuplicates()</a> ⇒</dt>
<dd><p>Based on the processed search term in all other ad groups, it searches for active keywords that exactly match the respective search term, initiates the creation of a keyword to be excluded if it is found and has the result of the processing written back to the Google Sheet.</p>
</dd>
</dl>
<dl>
<dt><a href="#createCampaignNegative">createCampaignNegative()</a> ⇒</dt>
<dd><p>Creates an exact match negative keyword at the campaign level, using the processed search term as the keyword text.</p>
</dd>
</dl>
<dl>
<dt><a href="#createAdGroupNegative">createAdGroupNegative()</a> ⇒</dt>
<dd><p>Creates an exact match negative keyword at the ad group level, using the processed search term as the keyword text.</p>
</dd>
</dl>
<dl>
<dt><a href="#readSheet">readSheet()</a> ⇒</dt>
<dd><p>Reads the data (without header) from the Google Sheet into an array.</p>
</dd>
</dl>
<dl>
<dt><a href="#updateData">updateData()</a> ⇒</dt>
<dd><p>Writes the result for each search term to the Google Sheet in the "processed" column of the respective row.</p>
</dd>
</dl>

---

<a id="parameters"></a>

## Function parameters
<a href="#top"><button style="float:right;margin-top:-2.2em;">back to top</button></a>

### Script 1 - "SQ Deduplicator 22.1 Prepare Data"

### global ⇒

| Parameter | Type | Description |
| --- | --- | --- |
| sheetFileId | String | The ID of the Google Sheet to use. |
| batchAccountSnippet<br>(MCC&nbsp;Version&nbsp;only) | Object | The content of the "Batch Service Response". (Required for automatic determination of the ocid parameter.) |

<a id="main1"></a>
### main() ⇒
MCC version below.<br>
Single account version see <a href="#processAccount1">processAccount()</a>

| Parameter | Type | Description |
| --- | --- | --- |
| accountIds | Array | Contains the account IDs of the Google Ads accounts to be processed. |

<a id="processAccount1"></a>
### processAccount() ⇒
MCC version below.<br>
Runs as main() in single account version</a>

| Parameter | Type | Description |
| --- | --- | --- |
| accountId | String | The account ID of the processed account. |
| ocid | String | The ocid parameter matching the processed account. (Required for creating Google Ads deep links.) |
| sheetStatus | Integer | 2 = new spreadsheet was created.<br>1 = content was removed from existing spreadsheet. |
| activeSearchTerms | Array | Return values ​​from <a href="#getActiveSearchTerms">getActiveSearchTerms()</a> |

<a id="prepareSheet"></a>
### prepareSheet() ⇒

| Parameter | Type | Description |
| --- | --- | --- |
| sheetFileId | String | The ID of the Google Sheet to use. |
| accountId | String | The account ID of the processed account. |
| ss | Spreadsheet&nbsp;Object | The Google Sheet to use |
| templateSheet | Sheet&nbsp;Object | The empty sheet template within the Google Sheets used. (Used for creating new sheets for processed accounts.) |

<a id="getActiveSearchTerms"></a>
### getActiveSearchTerms() ⇒

| Parameter | Type | Description |
| --- | --- | --- |
| ocid | String | The ocid parameter matching the processed account. (Required for creating Google Ads deep links.) |
| activeSearchTerms | Array | Return values for <a href="#processAccount1">processAccount()</a> |
| query | String | GAQL query to perform search for active search terms using AdsApp.search()|
| search | AdsApp.SearchRowIterator | see <a href="https://developers.google.com/google-ads/scripts/docs/reference/adsapp/adsapp_searchrowiterator" target="_blank">AdsApp.SearchRowIterator</a> |
| googleAdsDeeplink | String | The Google Ads deep link to the ad group of the respective search term |

<a id="writeData"></a>
### writeData() ⇒

| Parameter | Type | Description |
| --- | --- | --- |
| data | Array | Return values from <a href="#getActiveSearchTerms">getActiveSearchTerms()</a>. |
| sheetFileId | String | The ID of the Google Sheet to use. |
| sheetName | String | The account ID of the processed account. |
| sheet | Spreadsheet&nbsp;Object | The Google Sheet used. |

---

### Script 2 - "SQ Deduplicator 22.1 Process Data"
<a href="#top"><button style="float:right;margin-top:-2.2em;">back to top</button></a>

### global ⇒

| Parameter | Type | Description |
| --- | --- | --- |
| sheetFileId | String | The ID of the Google Sheet to use. |

<a id="main2"></a>
### main() ⇒
MCC version below.<br>
Single account version see <a href="#processAccount2">processAccount()</a>

| Parameter | Type | Description |
| --- | --- | --- |
| accountIds | Array | Contains the account IDs of the Google Ads accounts to be processed. |

<a id="processAccount2"></a>
### processAccount() ⇒
MCC version below.<br>
Runs as main() in single account version</a>

| Parameter | Type | Description |
| --- | --- | --- |
| accountId | String | The account ID of the processed account. |
| sheet | Spreadsheet&nbsp;Object | The Google Sheet used. |
| existingValues | Array | All data rows (without header) of the processed account spreadsheet. |
| filteredValues | Array | Filtered rows from existingValues ​​with no values ​​in column "processed". |
| count | Integer | Auxiliary variable for counting the rows already processed |
| status | String | Return value from <a href="#checkForDuplicates">checkForDuplicates()</a>. (See <a href="#returnvalues">Return values ​​from Script 2</a>) |


<a id="checkForDuplicates"></a>
### checkForDuplicates() ⇒

| Parameter | Type | Description |
| --- | --- | --- |
| rowData | Array | Input values ​​from <a href="#processAccount2">processAccount()</a>. (The row to process from filteredValues.) |
| accountId | String | The account ID of the processed account. |
| query | String | GAQL query to search for already booked keywords in other ad groups using AdsApp.search() |
| search | AdsApp.SearchRowIterator | See <a href="https://developers.google.com/google-ads/scripts/docs/reference/adsapp/adsapp_searchrowiterator" target="_blank">AdsApp.SearchRowIterator</a> |


<a id="createCampaignNegative"></a>
### createCampaignNegative() ⇒

| Parameter | Type | Description |
| --- | --- | --- |
| term | String | Keyword text to create the negative keyword. |
| campaign | Integer | ID of the campaign in which to create the negative keyword. |

<a id="createAdGroupNegative"></a>
### createAdGroupNegative() ⇒

| Parameter | Type | Description |
| --- | --- | --- |
| term | String | Keyword text to create the negative keyword. |
| adgroup | Integer | ID of the ad group in which to create the negative keyword. |

<a id="readSheet"></a>
### readSheet() ⇒

| Parameter | Type | Description |
| --- | --- | --- |
| sheet | Spreadsheet&nbsp;Object | The Google Sheet used. |

<a id="updateData"></a>
### updateData() ⇒

| Parameter | Type | Description |
| --- | --- | --- |
| sheet | Spreadsheet&nbsp;Object | The Google Sheet used. |
| index | Integer | Relative row number of the processed search term in the spreadsheet |
| status | String | Return value from <a href="#checkForDuplicates">checkForDuplicates()</a>. (See <a href="#returnvalues">Return values ​​from Script 2</a>) |
