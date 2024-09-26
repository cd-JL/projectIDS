import React from 'react'
import './app.css'

export default function Sensor() {
  return (
    <div id  = "row">
      <table class="table table-striped table-hover" data-testid="vuln-results-table">
					<thead>
						<tr>
							<th nowrap="nowrap">Vuln ID <i class="fa fa-bug fa-flip-vertical"></i></th>
							<th>Summary <i class="fa fa-info-circle"></i></th>
							<th nowrap="nowrap">CVSS Severity <i class="fa fa-balance-scale"></i></th>
						</tr>
					</thead>
					<tbody>

						<tr data-testid="vuln-row-0">
							<th nowrap="nowrap"><strong><a href="/vuln/detail/CVE-2024-38016" data-testid="vuln-detail-link-0">CVE-2024-38016</a></strong><br/></th>
							<td>
								<p data-testid="vuln-summary-0">Microsoft Office Visio Remote Code Execution Vulnerability</p> <strong>Published:</strong>
								<span data-testid="vuln-published-on-0">September 19, 2024; 1:15:12 PM -0400</span>
							</td>
							<td nowrap="nowrap">

								

								<span id="Cvss4NAText-0" data-testid="vuln-cvss4-na-0">
										<em>V4.0:</em>(not available)<br/>
								</span>

								<span id="cvss3-link">
										<em>V3.1:</em>
									<a href="/vuln-metrics/cvss/v3-calculator?name=CVE-2024-38016&amp;vector=AV:L/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:H&amp;version=3.1&amp;source=Microsoft%20Corporation" class="label label-danger" data-testid="vuln-cvss3-link-0">7.8 HIGH</a>
									<br/>
								</span>

								

							
								


							 	<span id="Cvss2NAText-0" data-testid="vuln-cvss2-na-0">
									<em>V2.0:</em>(not available)
							 	</span>
							</td>
						</tr>

						<tr data-testid="vuln-row-1">
							<th nowrap="nowrap"><strong><a href="/vuln/detail/CVE-2024-47086" data-testid="vuln-detail-link-1">CVE-2024-47086</a></strong><br/></th>
							<td>
								<p data-testid="vuln-summary-1">This vulnerability exists in Apex Softcell LD DP Back Office due to improper implementation of OTP validation mechanism in certain API endpoints. An authenticated remote attacker could exploit this vulnerability by providing arbitrary OTP value for authentication and subsequently changing its API response.  

Successful exploitation of this vulnerability could allow the attacker to bypass OTP verification for other user accounts.</p> <strong>Published:</strong>
								<span data-testid="vuln-published-on-1">September 19, 2024; 2:15:03 AM -0400</span>
							</td>
							<td nowrap="nowrap">

								
								

								<span id="Cvss4NAText-1" data-testid="vuln-cvss4-na-1">
										<em>V4.0:</em>(not available)<br/>
								</span>


								
								

								<span id="Cvss3NAText-1" data-testid="vuln-cvss3-na-1">
										<em>V3.x:</em>(not available)<br/>
								</span>

								
								


							 	<span id="Cvss2NAText-1" data-testid="vuln-cvss2-na-1">
									<em>V2.0:</em>(not available)
							 	</span>
							</td>
						</tr>

						<tr data-testid="vuln-row-2">
							<th nowrap="nowrap"><strong><a href="/vuln/detail/CVE-2024-47085" data-testid="vuln-detail-link-2">CVE-2024-47085</a></strong><br/></th>
							<td>
								<p data-testid="vuln-summary-2">This vulnerability exists in Apex Softcell LD DP Back Office due to improper validation of certain parameters (cCdslClicentcode and cLdClientCode) in the API endpoint. An authenticated remote attacker could exploit this vulnerability by manipulating parameters in the API request body leading to exposure of sensitive information belonging to other users.</p> <strong>Published:</strong>
								<span data-testid="vuln-published-on-2">September 19, 2024; 2:15:02 AM -0400</span>
							</td>
							<td nowrap="nowrap">

								
								

								<span id="Cvss4NAText-2" data-testid="vuln-cvss4-na-2">
										<em>V4.0:</em>(not available)<br/>
								</span>


								
								

								<span id="Cvss3NAText-2" data-testid="vuln-cvss3-na-2">
										<em>V3.x:</em>(not available)<br/>
								</span>

								
								


							 	<span id="Cvss2NAText-2" data-testid="vuln-cvss2-na-2">
									<em>V2.0:</em>(not available)
							 	</span>
							</td>
						</tr>

						<tr data-testid="vuln-row-3">
							<th nowrap="nowrap"><strong><a href="/vuln/detail/CVE-2024-44430" data-testid="vuln-detail-link-3">CVE-2024-44430</a></strong><br/></th>
							<td>
								<p data-testid="vuln-summary-3">SQL Injection vulnerability in Best Free Law Office Management Software-v1.0 allows an attacker to execute arbitrary code and obtain sensitive information via a crafted payload to the kortex_lite/control/register_case.php interface</p> <strong>Published:</strong>
								<span data-testid="vuln-published-on-3">September 13, 2024; 4:15:02 PM -0400</span>
							</td>
							<td nowrap="nowrap">

								
								

								<span id="Cvss4NAText-3" data-testid="vuln-cvss4-na-3">
										<em>V4.0:</em>(not available)<br/>
								</span>


								
								<span id="cvss3-link">
										<em>V3.1:</em>
									<a href="/vuln-metrics/cvss/v3-calculator?name=CVE-2024-44430&amp;vector=AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H&amp;version=3.1&amp;source=NIST" class="label label-critical" data-testid="vuln-cvss3-link-3">9.8 CRITICAL</a>
									<br/>
								</span>

								

								
								


							 	<span id="Cvss2NAText-3" data-testid="vuln-cvss2-na-3">
									<em>V2.0:</em>(not available)
							 	</span>
							</td>
						</tr>

						<tr data-testid="vuln-row-4">
							<th nowrap="nowrap"><strong><a href="/vuln/detail/CVE-2024-43463" data-testid="vuln-detail-link-4">CVE-2024-43463</a></strong><br/></th>
							<td>
								<p data-testid="vuln-summary-4">Microsoft Office Visio Remote Code Execution Vulnerability</p> <strong>Published:</strong>
								<span data-testid="vuln-published-on-4">September 10, 2024; 1:15:33 PM -0400</span>
							</td>
							<td nowrap="nowrap">

								
								

								<span id="Cvss4NAText-4" data-testid="vuln-cvss4-na-4">
										<em>V4.0:</em>(not available)<br/>
								</span>


								
								<span id="cvss3-link">
										<em>V3.1:</em>
									<a href="/vuln-metrics/cvss/v3-calculator?name=CVE-2024-43463&amp;vector=AV:L/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:H&amp;version=3.1&amp;source=NIST" class="label label-danger" data-testid="vuln-cvss3-link-4">7.8 HIGH</a>
									<br/>
								</span>

								

								
								


							 	<span id="Cvss2NAText-4" data-testid="vuln-cvss2-na-4">
									<em>V2.0:</em>(not available)
							 	</span>
							</td>
						</tr>

						<tr data-testid="vuln-row-5">
							<th nowrap="nowrap"><strong><a href="/vuln/detail/CVE-2024-37728" data-testid="vuln-detail-link-5">CVE-2024-37728</a></strong><br/></th>
							<td>
								<p data-testid="vuln-summary-5">Arbitrary File Read vulnerability in Xi'an Daxi Information Technology Co., Ltd OfficeWeb365 v.7.18.23.0 and v8.6.1.0 allows a remote attacker to obtain sensitive information via the "Pic/Indexes" interface</p> <strong>Published:</strong>
								<span data-testid="vuln-published-on-5">September 10, 2024; 10:15:12 AM -0400</span>
							</td>
							<td nowrap="nowrap">

								
								

								<span id="Cvss4NAText-5" data-testid="vuln-cvss4-na-5">
										<em>V4.0:</em>(not available)<br/>
								</span>


								
								

								<span id="Cvss3NAText-5" data-testid="vuln-cvss3-na-5">
										<em>V3.x:</em>(not available)<br/>
								</span>

								
								


							 	<span id="Cvss2NAText-5" data-testid="vuln-cvss2-na-5">
									<em>V2.0:</em>(not available)
							 	</span>
							</td>
						</tr>

						<tr data-testid="vuln-row-6">
							<th nowrap="nowrap"><strong><a href="/vuln/detail/CVE-2024-8601" data-testid="vuln-detail-link-6">CVE-2024-8601</a></strong><br/></th>
							<td>
								<p data-testid="vuln-summary-6">This vulnerability exists in TechExcel Back Office Software versions prior to 1.0.0 due to improper access controls on certain API endpoints. An authenticated remote attacker could exploit this vulnerability by manipulating a parameter through API request URL which could lead to unauthorized access to sensitive information belonging to other users.</p> <strong>Published:</strong>
								<span data-testid="vuln-published-on-6">September 09, 2024; 6:15:03 AM -0400</span>
							</td>
							<td nowrap="nowrap">

								
								

								<span id="Cvss4NAText-6" data-testid="vuln-cvss4-na-6">
										<em>V4.0:</em>(not available)<br/>
								</span>


								
								<span id="cvss3-link">
										<em>V3.1:</em>
									<a href="/vuln-metrics/cvss/v3-calculator?name=CVE-2024-8601&amp;vector=AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N&amp;version=3.1&amp;source=NIST" class="label label-warning" data-testid="vuln-cvss3-link-6">6.5 MEDIUM</a>
									<br/>
								</span>

								

								
								


							 	<span id="Cvss2NAText-6" data-testid="vuln-cvss2-na-6">
									<em>V2.0:</em>(not available)
							 	</span>
							</td>
						</tr>

						<tr data-testid="vuln-row-7">
							<th nowrap="nowrap"><strong><a href="/vuln/detail/CVE-2024-8367" data-testid="vuln-detail-link-7">CVE-2024-8367</a></strong><br/></th>
							<td>
								<p data-testid="vuln-summary-7">A vulnerability was found in HM Courts &amp; Tribunals Service Probate Back Office up to c1afe0cdb2b2766d9e24872c4e827f8b82a6cd31. It has been classified as problematic. Affected is an unknown function of the file src/main/java/uk/gov/hmcts/probate/service/NotificationService.java of the component Markdown Handler. The manipulation leads to injection. Continious delivery with rolling releases is used by this product. Therefore, no version details of affected nor updated releases are available. The patch is identified as d90230d7cf575e5b0852d56660104c8bd2503c34. It is recommended to apply a patch to fix this issue.</p> <strong>Published:</strong>
								<span data-testid="vuln-published-on-7">September 01, 2024; 12:15:14 AM -0400</span>
							</td>
							<td nowrap="nowrap">

								
								

								<span id="Cvss4NAText-7" data-testid="vuln-cvss4-na-7">
										<em>V4.0:</em>(not available)<br/>
								</span>


								
								

								<span id="Cvss3NAText-7" data-testid="vuln-cvss3-na-7">
										<em>V3.x:</em>(not available)<br/>
								</span>

								
								


							 	<span id="Cvss2NAText-7" data-testid="vuln-cvss2-na-7">
									<em>V2.0:</em>(not available)
							 	</span>
							</td>
						</tr>

						<tr data-testid="vuln-row-8">
							<th nowrap="nowrap"><strong><a href="/vuln/detail/CVE-2024-45045" data-testid="vuln-detail-link-8">CVE-2024-45045</a></strong><br/></th>
							<td>
								<p data-testid="vuln-summary-8">Collabora Online is a collaborative online office suite based on LibreOffice technology. In the mobile (Android/iOS) device variants of Collabora Online it was possible to inject JavaScript via url encoded values in links contained in documents. Since the Android JavaScript interface allows access to internal functions, the likelihood that the app could be compromised via this vulnerability is considered high. Non-mobile variants are not affected. Mobile variants should update to the latest version provided by the platform appstore. There are no known workarounds for this vulnerability.</p> <strong>Published:</strong>
								<span data-testid="vuln-published-on-8">August 29, 2024; 1:15:08 PM -0400</span>
							</td>
							<td nowrap="nowrap">

								
								

								<span id="Cvss4NAText-8" data-testid="vuln-cvss4-na-8">
										<em>V4.0:</em>(not available)<br/>
								</span>


								
								<span id="cvss3-link">
										<em>V3.1:</em>
									<a href="/vuln-metrics/cvss/v3-calculator?name=CVE-2024-45045&amp;vector=AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:N&amp;version=3.1&amp;source=NIST" class="label label-warning" data-testid="vuln-cvss3-link-8">6.1 MEDIUM</a>
									<br/>
								</span>

								

								
								


							 	<span id="Cvss2NAText-8" data-testid="vuln-cvss2-na-8">
									<em>V2.0:</em>(not available)
							 	</span>
							</td>
						</tr>

						<tr data-testid="vuln-row-9">
							<th nowrap="nowrap"><strong><a href="/vuln/detail/CVE-2024-38869" data-testid="vuln-detail-link-9">CVE-2024-38869</a></strong><br/></th>
							<td>
								<p data-testid="vuln-summary-9">Zohocorp ManageEngine Endpoint Central affected by&nbsp;Incorrect authorization vulnerability in remote office deploy configurations.This issue affects Endpoint Central: before 11.3.2416.04 and before 11.3.2400.25.</p> <strong>Published:</strong>
								<span data-testid="vuln-published-on-9">August 23, 2024; 11:15:15 AM -0400</span>
							</td>
							<td nowrap="nowrap">

								

								<span id="Cvss4NAText-9" data-testid="vuln-cvss4-na-9">
										<em>V4.0:</em>(not available)<br/>
								</span>


								
								<span id="cvss3-link">
										<em>V3.1:</em>
									<a href="/vuln-metrics/cvss/v3-calculator?name=CVE-2024-38869&amp;vector=AV:N/AC:L/PR:L/UI:R/S:C/C:L/I:L/A:N&amp;version=3.1&amp;source=NIST" class="label label-warning" data-testid="vuln-cvss3-link-9">5.4 MEDIUM</a>
									<br/>
								</span>

								

								
								


							 	<span id="Cvss2NAText-9" data-testid="vuln-cvss2-na-9">
									<em>V2.0:</em>(not available)
							 	</span>
							</td>
						</tr>

						<tr data-testid="vuln-row-10">
							<th nowrap="nowrap"><strong><a href="/vuln/detail/CVE-2024-37311" data-testid="vuln-detail-link-10">CVE-2024-37311</a></strong><br/></th>
							<td>
								<p data-testid="vuln-summary-10">Collabora Online is a collaborative online office suite based on LibreOffice. In affected versions of Collabora Online, https connections from coolwsd to other hosts may incompletely verify the remote host's certificate's against the full chain of trust. This vulnerability is fixed in Collabora Online 24.04.4.3, 23.05.14.1, and 22.05.23.1.</p> <strong>Published:</strong>
								<span data-testid="vuln-published-on-10">August 23, 2024; 11:15:15 AM -0400</span>
							</td>
							<td nowrap="nowrap">

								
								

								<span id="Cvss4NAText-10" data-testid="vuln-cvss4-na-10">
										<em>V4.0:</em>(not available)<br/>
								</span>


								
								

								<span id="Cvss3NAText-10" data-testid="vuln-cvss3-na-10">
										<em>V3.x:</em>(not available)<br/>
								</span>

								
								


							 	<span id="Cvss2NAText-10" data-testid="vuln-cvss2-na-10">
									<em>V2.0:</em>(not available)
							 	</span>
							</td>
						</tr>

						<tr data-testid="vuln-row-11">
							<th nowrap="nowrap"><strong><a href="/vuln/detail/CVE-2024-7263" data-testid="vuln-detail-link-11">CVE-2024-7263</a></strong><br/></th>
							<td>
								<p data-testid="vuln-summary-11">Improper path validation in promecefpluginhost.exe in Kingsoft WPS Office version ranging from 12.2.0.13110 to 12.2.0.17115 (exclusive) on Windows allows an attacker to load an arbitrary Windows library.
The patch released in version 12.1.0.17119 to mitigate CVE-2024-7262 was not restrictive enough. Another parameter was not properly sanitized which leads to the execution of an arbitrary Windows library.</p> <strong>Published:</strong>
								<span data-testid="vuln-published-on-11">August 15, 2024; 11:15:22 AM -0400</span>
							</td>
							<td nowrap="nowrap">

								
								

								<span id="Cvss4NAText-11" data-testid="vuln-cvss4-na-11">
										<em>V4.0:</em>(not available)<br/>
								</span>


								
								<span id="cvss3-link">
										<em>V3.1:</em>
									<a href="/vuln-metrics/cvss/v3-calculator?name=CVE-2024-7263&amp;vector=AV:L/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:H&amp;version=3.1&amp;source=NIST" class="label label-danger" data-testid="vuln-cvss3-link-11">7.8 HIGH</a>
									<br/>
								</span>

								

								
								


							 	<span id="Cvss2NAText-11" data-testid="vuln-cvss2-na-11">
									<em>V2.0:</em>(not available)
							 	</span>
							</td>
						</tr>

						<tr data-testid="vuln-row-12">
							<th nowrap="nowrap"><strong><a href="/vuln/detail/CVE-2024-7262" data-testid="vuln-detail-link-12">CVE-2024-7262</a></strong><br/></th>
							<td>
								<p data-testid="vuln-summary-12">Improper path validation in promecefpluginhost.exe in Kingsoft WPS Office version ranging from 12.2.0.13110 to 12.2.0.16412 (exclusive) on Windows allows an attacker to load an arbitrary Windows library.
The vulnerability was found weaponized as a single-click exploit in the form of a deceptive spreadsheet document</p> <strong>Published:</strong>
								<span data-testid="vuln-published-on-12">August 15, 2024; 11:15:22 AM -0400</span>
							</td>
							<td nowrap="nowrap">

								
								

								<span id="Cvss4NAText-12" data-testid="vuln-cvss4-na-12">
										<em>V4.0:</em>(not available)<br/>
								</span>


								
								<span id="cvss3-link">
										<em>V3.1:</em>
									<a href="/vuln-metrics/cvss/v3-calculator?name=CVE-2024-7262&amp;vector=AV:L/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:H&amp;version=3.1&amp;source=NIST" class="label label-danger" data-testid="vuln-cvss3-link-12">7.8 HIGH</a>
									<br/>
								</span>

								

								
								


							 	<span id="Cvss2NAText-12" data-testid="vuln-cvss2-na-12">
									<em>V2.0:</em>(not available)
							 	</span>
							</td>
						</tr>

						<tr data-testid="vuln-row-13">
							<th nowrap="nowrap"><strong><a href="/vuln/detail/CVE-2024-38169" data-testid="vuln-detail-link-13">CVE-2024-38169</a></strong><br/></th>
							<td>
								<p data-testid="vuln-summary-13">Microsoft Office Visio Remote Code Execution Vulnerability</p> <strong>Published:</strong>
								<span data-testid="vuln-published-on-13">August 13, 2024; 2:15:24 PM -0400</span>
							</td>
							<td nowrap="nowrap">

								
								

								<span id="Cvss4NAText-13" data-testid="vuln-cvss4-na-13">
										<em>V4.0:</em>(not available)<br/>
								</span>


								
								<span id="cvss3-link">
										<em>V3.1:</em>
									<a href="/vuln-metrics/cvss/v3-calculator?name=CVE-2024-38169&amp;vector=AV:L/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:H&amp;version=3.1&amp;source=Microsoft%20Corporation" class="label label-danger" data-testid="vuln-cvss3-link-13">7.8 HIGH</a>
									<br/>
								</span>

								

								
								


							 	<span id="Cvss2NAText-13" data-testid="vuln-cvss2-na-13">
									<em>V2.0:</em>(not available)
							 	</span>
							</td>
						</tr>

						<tr data-testid="vuln-row-14">
							<th nowrap="nowrap"><strong><a href="/vuln/detail/CVE-2024-38084" data-testid="vuln-detail-link-14">CVE-2024-38084</a></strong><br/></th>
							<td>
								<p data-testid="vuln-summary-14">Microsoft OfficePlus Elevation of Privilege Vulnerability</p> <strong>Published:</strong>
								<span data-testid="vuln-published-on-14">August 13, 2024; 2:15:10 PM -0400</span>
							</td>
							<td nowrap="nowrap">

								
								

								<span id="Cvss4NAText-14" data-testid="vuln-cvss4-na-14">
										<em>V4.0:</em>(not available)<br/>
								</span>


								
								<span id="cvss3-link">
										<em>V3.1:</em>
									<a href="/vuln-metrics/cvss/v3-calculator?name=CVE-2024-38084&amp;vector=AV:L/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H&amp;version=3.1&amp;source=Microsoft%20Corporation" class="label label-danger" data-testid="vuln-cvss3-link-14">7.8 HIGH</a>
									<br/>
								</span>

								

								
								


							 	<span id="Cvss2NAText-14" data-testid="vuln-cvss2-na-14">
									<em>V2.0:</em>(not available)
							 	</span>
							</td>
						</tr>

						<tr data-testid="vuln-row-15">
							<th nowrap="nowrap"><strong><a href="/vuln/detail/CVE-2024-7686" data-testid="vuln-detail-link-15">CVE-2024-7686</a></strong><br/></th>
							<td>
								<p data-testid="vuln-summary-15">A vulnerability, which was classified as problematic, was found in SourceCodester Kortex Lite Advocate Office Management System 1.0. This affects an unknown part of the file register_case.php. The manipulation of the argument title/description/opposite_lawyer leads to cross site scripting. It is possible to initiate the attack remotely. The exploit has been disclosed to the public and may be used.</p> <strong>Published:</strong>
								<span data-testid="vuln-published-on-15">August 12, 2024; 9:38:57 AM -0400</span>
							</td>
							<td nowrap="nowrap">

								
								

								<span id="Cvss4NAText-15" data-testid="vuln-cvss4-na-15">
										<em>V4.0:</em>(not available)<br/>
								</span>


								
								<span id="cvss3-link">
										<em>V3.1:</em>
									<a href="/vuln-metrics/cvss/v3-calculator?name=CVE-2024-7686&amp;vector=AV:N/AC:L/PR:L/UI:R/S:C/C:L/I:L/A:N&amp;version=3.1&amp;source=NIST" class="label label-warning" data-testid="vuln-cvss3-link-15">5.4 MEDIUM</a>
									<br/>
								</span>

								

								
								


							 	<span id="Cvss2NAText-15" data-testid="vuln-cvss2-na-15">
									<em>V2.0:</em>(not available)
							 	</span>
							</td>
						</tr>

						<tr data-testid="vuln-row-16">
							<th nowrap="nowrap"><strong><a href="/vuln/detail/CVE-2024-7685" data-testid="vuln-detail-link-16">CVE-2024-7685</a></strong><br/></th>
							<td>
								<p data-testid="vuln-summary-16">A vulnerability, which was classified as problematic, has been found in SourceCodester Kortex Lite Advocate Office Management System 1.0. Affected by this issue is some unknown functionality of the file adds.php. The manipulation of the argument name/dob/email/mobile/address leads to cross site scripting. The attack may be launched remotely. The exploit has been disclosed to the public and may be used.</p> <strong>Published:</strong>
								<span data-testid="vuln-published-on-16">August 12, 2024; 9:38:57 AM -0400</span>
							</td>
							<td nowrap="nowrap">

								
								

								<span id="Cvss4NAText-16" data-testid="vuln-cvss4-na-16">
										<em>V4.0:</em>(not available)<br/>
								</span>


								
								<span id="cvss3-link">
										<em>V3.1:</em>
									<a href="/vuln-metrics/cvss/v3-calculator?name=CVE-2024-7685&amp;vector=AV:N/AC:L/PR:L/UI:R/S:C/C:L/I:L/A:N&amp;version=3.1&amp;source=NIST" class="label label-warning" data-testid="vuln-cvss3-link-16">5.4 MEDIUM</a>
									<br/>
								</span>

								

								
								


							 	<span id="Cvss2NAText-16" data-testid="vuln-cvss2-na-16">
									<em>V2.0:</em>(not available)
							 	</span>
							</td>
						</tr>

						<tr data-testid="vuln-row-17">
							<th nowrap="nowrap"><strong><a href="/vuln/detail/CVE-2024-7684" data-testid="vuln-detail-link-17">CVE-2024-7684</a></strong><br/></th>
							<td>
								<p data-testid="vuln-summary-17">A vulnerability classified as problematic was found in SourceCodester Kortex Lite Advocate Office Management System 1.0. Affected by this vulnerability is an unknown functionality of the file add_act.php. The manipulation of the argument aname leads to cross site scripting. The attack can be launched remotely. The exploit has been disclosed to the public and may be used.</p> <strong>Published:</strong>
								<span data-testid="vuln-published-on-17">August 12, 2024; 9:38:56 AM -0400</span>
							</td>
							<td nowrap="nowrap">

								
								

								<span id="Cvss4NAText-17" data-testid="vuln-cvss4-na-17">
										<em>V4.0:</em>(not available)<br/>
								</span>


								
								<span id="cvss3-link">
										<em>V3.1:</em>
									<a href="/vuln-metrics/cvss/v3-calculator?name=CVE-2024-7684&amp;vector=AV:N/AC:L/PR:L/UI:R/S:C/C:L/I:L/A:N&amp;version=3.1&amp;source=NIST" class="label label-warning" data-testid="vuln-cvss3-link-17">5.4 MEDIUM</a>
									<br/>
								</span>

								

								
								


							 	<span id="Cvss2NAText-17" data-testid="vuln-cvss2-na-17">
									<em>V2.0:</em>(not available)
							 	</span>
							</td>
						</tr>

						<tr data-testid="vuln-row-18">
							<th nowrap="nowrap"><strong><a href="/vuln/detail/CVE-2024-7683" data-testid="vuln-detail-link-18">CVE-2024-7683</a></strong><br/></th>
							<td>
								<p data-testid="vuln-summary-18">A vulnerability classified as problematic has been found in SourceCodester Kortex Lite Advocate Office Management System 1.0. Affected is an unknown function of the file addcase_stage.php. The manipulation of the argument cname leads to cross site scripting. It is possible to launch the attack remotely. The exploit has been disclosed to the public and may be used.</p> <strong>Published:</strong>
								<span data-testid="vuln-published-on-18">August 12, 2024; 9:38:56 AM -0400</span>
							</td>
							<td nowrap="nowrap">

								
								

								<span id="Cvss4NAText-18" data-testid="vuln-cvss4-na-18">
										<em>V4.0:</em>(not available)<br/>
								</span>


								
								<span id="cvss3-link">
										<em>V3.1:</em>
									<a href="/vuln-metrics/cvss/v3-calculator?name=CVE-2024-7683&amp;vector=AV:N/AC:L/PR:L/UI:R/S:C/C:L/I:L/A:N&amp;version=3.1&amp;source=NIST" class="label label-warning" data-testid="vuln-cvss3-link-18">5.4 MEDIUM</a>
									<br/>
								</span>

								

								
								


							 	<span id="Cvss2NAText-18" data-testid="vuln-cvss2-na-18">
									<em>V2.0:</em>(not available)
							 	</span>
							</td>
						</tr>

						<tr data-testid="vuln-row-19">
							<th nowrap="nowrap"><strong><a href="/vuln/detail/CVE-2024-7642" data-testid="vuln-detail-link-19">CVE-2024-7642</a></strong><br/></th>
							<td>
								<p data-testid="vuln-summary-19">A vulnerability has been found in SourceCodester Kortex Lite Advocate Office Management System 1.0 and classified as critical. Affected by this vulnerability is an unknown functionality of the file activate_act.php. The manipulation of the argument id leads to sql injection. The attack can be launched remotely. The exploit has been disclosed to the public and may be used.</p> <strong>Published:</strong>
								<span data-testid="vuln-published-on-19">August 12, 2024; 9:38:47 AM -0400</span>
							</td>
							<td nowrap="nowrap">

								
								

								<span id="Cvss4NAText-19" data-testid="vuln-cvss4-na-19">
										<em>V4.0:</em>(not available)<br/>
								</span>


								
								<span id="cvss3-link">
										<em>V3.1:</em>
									<a href="/vuln-metrics/cvss/v3-calculator?name=CVE-2024-7642&amp;vector=AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H&amp;version=3.1&amp;source=NIST" class="label label-critical" data-testid="vuln-cvss3-link-19">9.8 CRITICAL</a>
									<br/>
								</span>

								

								
								


							 	<span id="Cvss2NAText-19" data-testid="vuln-cvss2-na-19">
									<em>V2.0:</em>(not available)
							 	</span>
							</td>
						</tr>



					</tbody>
				</table>
    </div>
  )
}
