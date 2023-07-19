<a href id="top"></a>
# Google Ads Script Search Query Deduplicator 22.1 - DEUTSCH
English version: <a href="https://github.com/RicSti/google-ads-scripts-search-query-deduplicator/blob/main/README.md">README.md</a>

## Beschreibung
Identifiziere mit diesem Google Ads Script alle Suchbegriffe, die nicht in der angedachten Anzeigengruppe matchen und schließe diese automatisch aus.

## Übersicht
* <a href="#installation">Installation</a>
* <a href="#ausführung">Erste Ausführung & Übersicht der Spalten im Sheet</a>
* <a href="#planung">Planung / regelmäßige Ausführung</a>
* <a href="#funktionen">Funktionsbeschreibungen</a>
* <a href="#parameter">Funktionsparameter</a>

---
<a id="installation"></a>

## Installation

### I. Google Ads Scripts einrichten

Öffne Dein Google Ads Konto oder Dein MCC und navigiere zu "Tools und Einstellungen > Bulk-Aktionen > Scripts".

Der Search Query Duplicator ist auf zwei Scripts aufgeteilt.

#### <strong>Script 1 - "SQ Deduplicator 22.1 Prepare Data"</strong>
Das erste Script bereitet die Daten zur Weiterarbeitung vor und schreibt sie in ein Google Sheet.

<u><i>Einrichtung:</i></u>

Erstelle ein neues Google Ads Script <i>(Namensvorschlag: "SQ Deduplicator 22.1 Prepare Data")</i> und überschreibe den Inhalt mit der passenden Code-Vorlage:

* Einzelnes Konto: single_account_prepare_data.js
* MCC-Version: mcc_version_prepare_data.js

#### <strong>Script 2 - "SQ Deduplicator 22.1 Process Data"</strong>
Das zweite Script verarbeitet die noch nicht verarbeiteten Zeilen aus dem Google Sheet und schreibt den Verarbeitungsstatus in die jeweilige Datenzeile zurück.

<u><i>Einrichtung:</i></u>

Erstelle ein neues Google Ads Script <i>(Namensvorschlag: "SQ Deduplicator 22.1 Process Data")</i> und überschreibe den Inhalt mit der passenden Code-Vorlage:

* Einzelnes Konto: single_account_process_data.js
* MCC-Version: mcc_version_process_data.js

### II. Google Sheet aus Template erstellen

Für die Zwischenspeicherung und Weiterverarbeitung der Suchbegriffe wird ein Google Sheet verwendet. Die Vorlage kannst Du mit folgendem Google Drive Link kopieren: <a href="https://docs.google.com/spreadsheets/d/1OARjoIsFVciGIxbvuwmjV6Wdflg1kDangp8s_R3LV10/copy" target="_blank">adtraffic Search Query Deduplicator Google Sheet Template</a>

Füge die ID Deines neu erstellten Google Sheets in beiden Scripts an der Stelle "{{Search Query Deduplicator Google Sheet ID}}" ein.

<a id="installIII"></a>

### _[optional]_ III BatchService Response (MCC) bzw. "ocid"-Parameter (Single Account) hinterlegen

Um Direktlinks zu den Google Ads Anzeigengruppen zu generieren, wird die "ocid" zum jeweiligen Google Ads Konto benötigt.

#### <u>III.a Google Ads "BatchService Response" (für MCC Version)</u>

Diese "ocid" kann aus der Response des BatchService auf MCC-Ebene für alle untergeordneten Konten ausgelesen werden. Um die Response als Object im Script zur Verfügung zu stellen, gehe wie folgt vor:

1. Öffne das betreffende MCC und navigiere zu "Konten > Leistung"
2. Öffne die Entwicklertools des Browsers und wähle den Reiter "Network" aus
3. Lade die Seite neu und filtere die Einträge mit "batch account"
4. Klicke den Eintrag an, der mit "Batch?authuser=" beginnt und wähle rechts die "Response" aus
5. Kopiere den kompletten Inhalt der Response und füge ihn im <u>Script 1 - "SQ Deduplicator 22.1 Prepare Data"</u> an der Stelle "{{BatchService Response}}" ein.

<strong>Alternativ:</strong>
<p>Entferne die Stelle "{{BatchService Response}}", sodass folgender Inhalt in der Zeile stehen bleibt:</p>
<code>let batchAccountSnippet = new Object();</code>
<hr>

#### <u>III.b Google Ads "ocid" (für Single Account Version)</u>

Für Einzelkonten kann die "ocid" aus der Adressleiste abgelesen werden.

1. Melde Dich in dem betreffenden Google Ads Konto an und kopiere die Ziffern hinter "ocid=" aus der Adressleiste Deines Browsers
2. Füge die kopierten Ziffern im <u>Script 1 - "SQ Deduplicator 22.1 Prepare Data"</u> an der Stelle "{{ocid}}" ein.

<strong>Alternativ:</strong>
<p>Entferne die Stelle "{{ocid}}", sodass folgender Inhalt in der Zeile stehen bleibt:</p>
<code>const ocid = '';</code>
<hr>

### _[optional]_ IV. Account IDs definieren (für MCC-Version)

Füge die Account IDs der zu verarbeitenden Konten als kommagetrennte Strings in beiden Scripts an der Stelle "{{Accound IDs Array}}" ein.

<u><i>Beispielsyntax:</i></u>
<code>'123-456-7890','456-123-7890','654-321-7890','321-654-7890'</code>

<strong>Alternativ:</strong>
<p>Entferne die Stelle "{{Accound IDs Array}}", sodass folgender Inhalt in der Zeile stehen bleibt:</p>
<code>let accountIds = [];</code>

---

<a id="ausführung"></a>

## Erste Ausführung / Übersicht der Spalten im Sheet
<a href="#top"><button style="float:right;margin-top:-2.2em;">nach oben</button></a>

Bei der ersten Ausführung des <u>Script 1 - "SQ Deduplicator 22.1 Prepare Data"</u> wird im Google Sheet für jedes verarbeitete Konto ein neues Tabellenblatt mit der jeweiligen Account ID als Tabellenblattname mit elf Spalten angelegt:

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

Die ersten sechs Spalten sind selbsterklärend.

Die Spalte "deepLink" enthält einen direkten Link zur Anzeigengruppe des jeweiligen Suchbegriffs (sofern die "ocid" verfügbar ist - siehe <a href="#installIII">Installation Schritt III</a>). Die Spalten "impressions", "clicks" und "conversions" enthalten die jeweiligen Werte für den abgefragten Zeitraum (standardmäßig die letzten 30 Tage).

Die letzte Spalte "processed" kann nach der Ausführung des <u>Script 2 - "SQ Deduplicator 22.1 Process Data"</u> sechs verschiedene Rückgabewerte enthalten:

<a id="rückgabewerte"></a>

### Rückgabewerte aus Script 2
<a href="#top"><button style="float:right;margin-top:-2.2em;">nach oben</button></a>

| Wert | Bedeutung |
| --- | --- |
| Term&nbsp;skipped | Der Suchbegriff entspricht keinem aktiv gebuchten Keyword im Konto. Es wurde kein auszuschließendes Keyword angelegt.
| Campaign&nbsp;Negative&nbsp;added | Der Suchbegriff entspricht einem aktiv gebuchten Keyword in einer anderen Kampagne. Es wurde ein auszuschließendes Keyword in der Kampagne des gefundenen Suchbegriffs angelegt. (*)
| Campaign&nbsp;Negative&nbsp;skipped | Der Suchbegriff entspricht einem aktiv gebuchten Keyword in einer anderen Kampagne. Es wurde aber kein auszuschließendes Keyword in der Kampagne des gefundenen Suchbegriffs angelegt, weil dort bereits ein entsprechendes auszuschließendes Keyword gebucht ist.
| AdGroup&nbsp;Negative&nbsp;added | Der Suchbegriff entspricht einem aktiv gebuchten Keyword in einer anderen Anzeigengruppe derselben Kampagne. Es wurde ein auszuschließendes Keyword in der Anzeigengruppe des gefundenen Suchbegriffs angelegt. (*)
| AdGroup&nbsp;Negative&nbsp;skipped | Der Suchbegriff entspricht einem aktiv gebuchten Keyword in einer anderen Anzeigengruppe derselben Kampagne. Es wurde aber kein auszuschließendes Keyword in der Anzeigengruppe des gefundenen Suchbegriffs angelegt, weil dort bereits ein entsprechendes auszuschließendes Keyword gebucht ist.
| Comparison&nbsp;failed | Bei der Verarbeitung der Daten aus dem Sheet wurde zwar mindestens ein Duplikat gefunden, allerdings ist beim Abgleich der campaignId ein Fehler aufgetreten.

(*) Wird das Script im Vorschaumodus ausgeführt, werden <strong><u>keine</u></strong> auszuschließenden Keywords angelegt. Im Script-Editor unter "Änderungen" sieht man, in welchen Kampagnen oder Anzeigengruppen auszuschließende Keywords gebucht werden <strong><u>würden</u></strong>.

<hr>

<a id="planung"></a>

## Planung / regelmäßige Ausführung
<a href="#top"><button style="float:right;margin-top:-2.2em;">nach oben</button></a>

Durch die Ausführung des <u>Script 1 - "SQ Deduplicator 22.1 Prepare Data"</u> werden alle Daten im Google Sheet überschrieben. Für die meisten Konten sollte es ausreichen, das Script wöchentlich auszuführen. Bei großen Konten mit täglich mehreren Hundert neu identifizierten Suchanfragen macht eine tägliche Ausführung durchaus Sinn.

Das <u>Script 2 - "SQ Deduplicator 22.1 Process Data"</u> verarbeitet nur Zeilen ohne Wert in der Spalte "processed". Damit das Script bei sehr großen Mengen an zu verarbeitenten Suchbegriffen nicht in einen Timeout läuft, kann ein Limit für die maximal zu verarbeitenden Zeilen definiert werden (standardmäßig: 1.000 Zeilen). Bei der Planung des Script 2 sollte berücksichtigt werden, dass es ausreichend oft ausgeführt wird, um alle identifizierten Suchbegriffe zu verarbeiten.

<hr>

<a id="funktionen"></a>

## Funktionsbeschreibungen
<a href="#top"><button style="float:right;margin-top:-2.2em;">nach oben</button></a>

### Script 1 - "SQ Deduplicator 22.1 Prepare Data"

<dl>
<dt><a href="#main1">main()</a> ⇒</dt>
<dd><p>MCC-Version: Lädt die zu verarbeitenden Konten und startet die parallele Ausführung des Scripts.</p>
<p>Single-Account-Version: Entspricht im Grunde der MCC-Funktion <a href="#processAccount1">processAccount()</a></p>
</dd>
</dl>
<dl>
<dt><a href="#processAccount1">processAccount()</a> ⇒</dt>
<dd><p>Führt die Vorbereitung des Google Sheets aus, lädt dann die aktiven Suchbegriffe und startet den Schreibvorgang der aggregierten Suchbegriffe ins Google Sheet.</p>
</dd>
</dl>
<dl>
<dt><a href="#prepareSheet">prepareSheet()</a> ⇒</dt>
<dd><p>Legt im Google Sheet ein neues Tabellenblatt für das zu verarbeitende Konto an oder löscht die darin enthaltenen Daten, sofern bereits ein Tabellenblatt für das jeweilige Konto vorhanden ist.</p>
</dd>
</dl>
<dl>
<dt><a href="#getActiveSearchTerms">getActiveSearchTerms()</a> ⇒</dt>
<dd><p>Ruft alle Suchbegriffe ab, die im gegebenen Zeitraum (standardmäßig 30 Tage) <u><strong>nicht</strong></u> mit Match Type EXACT oder NEAR EXACT gematcht haben und eine Mindestanzahl an Impressionen (standardmäßig 30) generiert haben.</p>
</dd>
</dl>
<dl>
<dt><a href="#writeData">writeData()</a> ⇒</dt>
<dd><p>Schreibt die vorbereiteten Daten ins Google Sheet.</p>
</dd>
</dl>

---

### Script 2 - "SQ Deduplicator 22.1 Process Data"
<a href="#top"><button style="float:right;margin-top:-2.2em;">nach oben</button></a>

<dl>
<dt><a href="#main2">main()</a> ⇒</dt>
<dd><p>MCC-Version: Lädt die zu verarbeitenden Konten und startet die parallele Ausführung des Scripts.</p>
<p>Single-Account-Version: Entspricht im Grunde der MCC-Funktion <a href="#processAccount2">processAccount()</a></p>
</dd>
</dl>
<dl>
<dt><a href="#processAccount2">processAccount()</a> ⇒</dt>
<dd><p>Führt die Vorbereitung des Google Sheets aus, lädt dann die aktiven Suchbegriffe und startet den Schreibvorgang der aggregierten Suchbegriffe ins Google Sheet.</p>
</dd>
</dl>
<dl>
<dt><a href="#checkForDuplicates">checkForDuplicates()</a> ⇒</dt>
<dd><p>Sucht ausgehend vom jeweils verarbeiteten Suchbegriff in allen anderen Anzeigengruppen nach aktiven Keywords, die genau mit dem jeweiligen Suchbegriff übereinstimmen, initiiert im Falle eines Fundes die Erstellung eines auszuschließenden Keywords und lässt dasErgebnis der Verarbeitung ins Google Sheet zurückschreiben.</p>
</dd>
</dl>
<dl>
<dt><a href="#createCampaignNegative">createCampaignNegative()</a> ⇒</dt>
<dd><p>Erstellt auf Kampagnenebene ein genau passend auszuschließendes Keyword mit dem jeweils verarbeiteten Suchbegriff als Keyword-Text.</p>
</dd>
</dl>
<dl>
<dt><a href="#createAdGroupNegative">createAdGroupNegative()</a> ⇒</dt>
<dd><p>Erstellt auf Anzeigengruppenebene ein genau passend auszuschließendes Keyword mit dem jeweils verarbeiteten Suchbegriff als Keyword-Text.</p>
</dd>
</dl>
<dl>
<dt><a href="#readSheet">readSheet()</a> ⇒</dt>
<dd><p>Liest die Daten ohne Kopfzeile aus dem Google Sheet in ein Array.</p>
</dd>
</dl>
<dl>
<dt><a href="#updateData">updateData()</a> ⇒</dt>
<dd><p>Schreibt (je Suchbegriff) das Ergebnis der Verarbeitung ins Google Sheet in die Spalte "processed" der jeweiligen Zeile.</p>
</dd>
</dl>

<hr>

<a id="parameter"></a>

## Funktionsparameter
<a href="#top"><button style="float:right;margin-top:-2.2em;">nach oben</button></a>

### Script 1 - "SQ Deduplicator 22.1 Prepare Data"

### global ⇒

| Parameter | Typ | Beschreibung |
| --- | --- | --- |
| sheetFileId | String | Die ID des zu verwendenden Google Sheets. |
| batchAccountSnippet<br>(nur&nbsp;in&nbsp;MCC-Version) | Object | Der Inhalt der "Batch Service Response". (Wird zur automatischen Ermittlung der ocid benötigt.) |

<a id="main1"></a>
### main() ⇒
MCC-Version nachfolgend.<br>
Single-Account-Version siehe <a href="#processAccount1">processAccount()</a>

| Parameter | Typ | Beschreibung |
| --- | --- | --- |
| accountIds | Array | Beinhaltet die Account IDs der zu verarbeitenden Google Ads Konten. |

<a id="processAccount1"></a>
### processAccount() ⇒
MCC-Version nachfolgend.<br>
Wird in Single-Account-Version als main() ausgeführt</a>

| Parameter | Typ | Beschreibung |
| --- | --- | --- |
| accountId | String | Die Account ID des verarbeiteten Kontos. |
| ocid | String | Die zum verarbeiteten Konto passende ocid. (Wird benötigt für die Erstellung von Google Ads Deeplinks.) |
| sheetStatus | Integer | 2 = neues Tabellenblatt wurde angelegt.<br>1 = Inhalte wurden aus bestehendem Tabellenblatt entfernt. |
| activeSearchTerms | Array | Rückgabewerte aus <a href="#getActiveSearchTerms">getActiveSearchTerms()</a> |

<a id="prepareSheet"></a>
### prepareSheet() ⇒

| Parameter | Typ | Beschreibung |
| --- | --- | --- |
| sheetFileId | String | Die ID des zu verwendenden Google Sheets. |
| accountId | String | Die Account ID des verarbeiteten Kontos. |
| ss | Spreadsheet&nbsp;Object | Das zu verwendende Google Sheet |
| templateSheet | Sheet&nbsp;Object | Die leere Tabellenblattvorlage innerhalb des verwendeten Google Sheets. (Wird für die Erstellung neuer Tabellenblätter für verarbeitete Konten verwendet.) |

<a id="getActiveSearchTerms"></a>
### getActiveSearchTerms() ⇒

| Parameter | Typ | Beschreibung |
| --- | --- | --- |
| ocid | String | Die zum verarbeiteten Konto passende ocid. (Wird benötigt für die Erstellung von Google Ads Deeplinks.) |
| activeSearchTerms | Array | Rückgabewerte für <a href="#processAccount1">processAccount()</a> |
| query | String | GAQL Abfrage zur Ausführung der Suche nach aktiven Suchbegriffen mittels AdsApp.search() |
| search | AdsApp.SearchRowIterator | siehe <a href="https://developers.google.com/google-ads/scripts/docs/reference/adsapp/adsapp_searchrowiterator" target="_blank">AdsApp.SearchRowIterator</a> |
| googleAdsDeeplink | String | Der Google Ads Deeplink zur Anzeigengruppe des jeweiligen Suchbegriffs |

<a id="writeData"></a>
### writeData() ⇒

| Parameter | Typ | Beschreibung |
| --- | --- | --- |
| data | Array | Die Rückgabewerte aus <a href="#getActiveSearchTerms">getActiveSearchTerms()</a>. |
| sheetFileId | String | Die ID des zu verwendenden Google Sheets. |
| sheetName | String | Die Account ID des verarbeiteten Kontos. |
| sheet | Spreadsheet&nbsp;Object | Das verwendete Google Sheet. |

---

### Script 2 - "SQ Deduplicator 22.1 Process Data"
<a href="#top"><button style="float:right;margin-top:-2.2em;">nach oben</button></a>

### global ⇒

| Parameter | Typ | Beschreibung |
| --- | --- | --- |
| sheetFileId | String | Die ID des zu verwendenden Google Sheets. |

<a id="main2"></a>
### main() ⇒
MCC-Version nachfolgend.<br>
Single-Account-Version siehe <a href="#processAccount2">processAccount()</a>

| Parameter | Typ | Beschreibung |
| --- | --- | --- |
| accountIds | Array | Beinhaltet die Account IDs der zu verarbeitenden Google Ads Konten. |

<a id="processAccount2"></a>
### processAccount() ⇒
MCC-Version nachfolgend.<br>
Wird in Single-Account-Version als main() ausgeführt</a>

| Parameter | Typ | Beschreibung |
| --- | --- | --- |
| accountId | String | Die Account ID des verarbeiteten Kontos. |
| sheet | Spreadsheet&nbsp;Object | Das verwendete Google Sheet. |
| existingValues | Array | Alle Datenzeilen (ohne Kopfzeile) des Tabellenblatts des verarbeiteten Kontos. |
| filteredValues | Array | Gefilterte Zeilen aus existingValues ohne Werte in Spalte "processed". |
| count | Integer | Hilfsvariable zur Zählung der bereits verarbeiteten Zeilen |
| status | String | Rückgabewert aus <a href="#checkForDuplicates">checkForDuplicates()</a>. (Siehe <a href="#rückgabewerte">Rückgabewerte aus Script 2</a>) |


<a id="checkForDuplicates"></a>
### checkForDuplicates() ⇒

| Parameter | Typ | Beschreibung |
| --- | --- | --- |
| rowData | Array | Eingabewerte aus <a href="#processAccount2">processAccount()</a>. (Die zu verarbeitende Zeile aus filteredValues.) |
| accountId | String | Die Account ID des verarbeiteten Kontos. |
| query | String | GAQL Abfrage zur Ausführung der Suche nach bereits gebuchten Keyword in anderen Anzeigengruppen mittels AdsApp.search() |
| search | AdsApp.SearchRowIterator | siehe <a href="https://developers.google.com/google-ads/scripts/docs/reference/adsapp/adsapp_searchrowiterator" target="_blank">AdsApp.SearchRowIterator</a> |


<a id="createCampaignNegative"></a>
### createCampaignNegative() ⇒

| Parameter | Typ | Beschreibung |
| --- | --- | --- |
| term | String | Keyword-Text zur Erstellung des auszuschließenden Keywords. |
| campaign | Integer | ID der Kampagne, in der das auszuschließende Keyword erstellt werden soll. |

<a id="createAdGroupNegative"></a>
### createAdGroupNegative() ⇒

| Parameter | Typ | Beschreibung |
| --- | --- | --- |
| term | String | Keyword-Text zur Erstellung des auszuschließenden Keywords. |
| adgroup | Integer | ID der Anzeigengruppe, in der das auszuschließende Keyword erstellt werden soll. |

<a id="readSheet"></a>
### readSheet() ⇒

| Parameter | Typ | Beschreibung |
| --- | --- | --- |
| sheet | Spreadsheet&nbsp;Object | Das verwendete Google Sheet. |

<a id="updateData"></a>
### updateData() ⇒

| Parameter | Typ | Beschreibung |
| --- | --- | --- |
| sheet | Spreadsheet&nbsp;Object | Das verwendete Google Sheet. |
| index | Integer | Relative Zeilennummer des verarbeiteten Suchbegriffs im Tabellenblatt |
| status | String | Rückgabewert aus <a href="#checkForDuplicates">checkForDuplicates()</a>. (Siehe [Rückgabewerte aus Script 2](#rückgabewerte)) |