import React from 'react'

export default function Sensor3() {
  return (
    <div>
      <div id="row">

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
            <th nowrap="nowrap"><strong><a href="/vuln/detail/CVE-2024-25522" data-testid="vuln-detail-link-0">CVE-2024-25522</a></strong><br/></th>
            <td>
                <p data-testid="vuln-summary-0">RuvarOA v6.01 and v12.01 were discovered to contain a SQL injection vulnerability via the office_missive_id parameter at /WorkFlow/wf_work_form_save.aspx.</p> <strong>Published:</strong>
                <span data-testid="vuln-published-on-0">May 08, 2024; 11:15:08 AM -0400</span>
            </td>
            <td nowrap="nowrap">

              
                

                <span id="Cvss4NAText-0" data-testid="vuln-cvss4-na-0">
                        <em>V4.0:</em>(not available)<br/>
                </span>


                
                

                <span id="Cvss3NAText-0" data-testid="vuln-cvss3-na-0">
                        <em>V3.x:</em>(not available)<br/>
                </span>

                
                


                 <span id="Cvss2NAText-0" data-testid="vuln-cvss2-na-0">
                    <em>V2.0:</em>(not available)
                 </span>
            </td>
        </tr>

        <tr data-testid="vuln-row-1">
            <th nowrap="nowrap"><strong><a href="/vuln/detail/CVE-2023-51598" data-testid="vuln-detail-link-1">CVE-2023-51598</a></strong><br/></th>
            <td>
                <p data-testid="vuln-summary-1">Hancom Office Word DOC File Parsing Use-After-Free Remote Code Execution Vulnerability. This vulnerability allows remote attackers to execute arbitrary code on affected installations of Hancom Office Word. User interaction is required to exploit this vulnerability in that the target must visit a malicious page or open a malicious file.

The specific flaw exists within the parsing of DOC files. The issue results from the lack of validating the existence of an object prior to performing operations on the object. An attacker can leverage this vulnerability to execute code in the context of the current process. Was ZDI-CAN-20384.</p> <strong>Published:</strong>
                <span data-testid="vuln-published-on-1">May 02, 2024; 11:16:20 PM -0400</span>
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
            <th nowrap="nowrap"><strong><a href="/vuln/detail/CVE-2023-50235" data-testid="vuln-detail-link-2">CVE-2023-50235</a></strong><br/></th>
            <td>
                <p data-testid="vuln-summary-2">Hancom Office Show PPT File Parsing Stack-based Buffer Overflow Remote Code Execution Vulnerability. This vulnerability allows remote attackers to execute arbitrary code on affected installations of Hancom Office Show. User interaction is required to exploit this vulnerability in that the target must visit a malicious page or open a malicious file.

The specific flaw exists within the parsing of PPT files. The issue results from the lack of proper validation of the length of user-supplied data prior to copying it to a stack-based buffer. An attacker can leverage this vulnerability to execute code in the context of the current process. Was ZDI-CAN-20387.</p> <strong>Published:</strong>
                <span data-testid="vuln-published-on-2">May 02, 2024; 11:16:12 PM -0400</span>
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
            <th nowrap="nowrap"><strong><a href="/vuln/detail/CVE-2023-50234" data-testid="vuln-detail-link-3">CVE-2023-50234</a></strong><br/></th>
            <td>
                <p data-testid="vuln-summary-3">Hancom Office Cell XLS File Parsing Stack-based Buffer Overflow Remote Code Execution Vulnerability. This vulnerability allows remote attackers to execute arbitrary code on affected installations of Hancom Office Cell. User interaction is required to exploit this vulnerability in that the target must visit a malicious page or open a malicious file.

The specific flaw exists within the parsing of XLS files. The issue results from the lack of proper validation of the length of user-supplied data prior to copying it to a stack-based buffer. An attacker can leverage this vulnerability to execute code in the context of the current process. Was ZDI-CAN-20386.</p> <strong>Published:</strong>
                <span data-testid="vuln-published-on-3">May 02, 2024; 11:16:12 PM -0400</span>
            </td>
            <td nowrap="nowrap">

              
                

                <span id="Cvss4NAText-3" data-testid="vuln-cvss4-na-3">
                        <em>V4.0:</em>(not available)<br/>
                </span>


                
                

                <span id="Cvss3NAText-3" data-testid="vuln-cvss3-na-3">
                        <em>V3.x:</em>(not available)<br/>
                </span>

                
                


                 <span id="Cvss2NAText-3" data-testid="vuln-cvss2-na-3">
                    <em>V2.0:</em>(not available)
                 </span>
            </td>
        </tr>

        <tr data-testid="vuln-row-4">
            <th nowrap="nowrap"><strong><a href="/vuln/detail/CVE-2024-22438" data-testid="vuln-detail-link-4">CVE-2024-22438</a></strong><br/></th>
            <td>
                <p data-testid="vuln-summary-4">
A potential security vulnerability has been identified in Hewlett Packard Enterprise OfficeConnect 1820 Network switches. The vulnerability could be remotely exploited to allow execution of malicious code.

</p> <strong>Published:</strong>
                <span data-testid="vuln-published-on-4">April 15, 2024; 6:15:08 AM -0400</span>
            </td>
            <td nowrap="nowrap">

              
                

                <span id="Cvss4NAText-4" data-testid="vuln-cvss4-na-4">
                        <em>V4.0:</em>(not available)<br/>
                </span>


                
                

                <span id="Cvss3NAText-4" data-testid="vuln-cvss3-na-4">
                        <em>V3.x:</em>(not available)<br/>
                </span>

                
                


                 <span id="Cvss2NAText-4" data-testid="vuln-cvss2-na-4">
                    <em>V2.0:</em>(not available)
                 </span>
            </td>
        </tr>

        <tr data-testid="vuln-row-5">
            <th nowrap="nowrap"><strong><a href="/vuln/detail/CVE-2024-3735" data-testid="vuln-detail-link-5">CVE-2024-3735</a></strong><br/></th>
            <td>
                <p data-testid="vuln-summary-5">A vulnerability was found in Smart Office up to 20240405. It has been classified as problematic. Affected is an unknown function of the file Main.aspx. The manipulation of the argument New Password/Confirm Password with the input 1 leads to weak password requirements. It is possible to launch the attack remotely. The complexity of an attack is rather high. The exploitability is told to be difficult. The exploit has been disclosed to the public and may be used. VDB-260574 is the identifier assigned to this vulnerability. NOTE: The vendor was contacted early about this disclosure but did not respond in any way.</p> <strong>Published:</strong>
                <span data-testid="vuln-published-on-5">April 13, 2024; 9:15:46 AM -0400</span>
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
            <th nowrap="nowrap"><strong><a href="/vuln/detail/CVE-2024-3621" data-testid="vuln-detail-link-6">CVE-2024-3621</a></strong><br/></th>
            <td>
                <p data-testid="vuln-summary-6">A vulnerability was found in SourceCodester Kortex Lite Advocate Office Management System 1.0. It has been classified as critical. This affects an unknown part of the file /control/register_case.php. The manipulation of the argument title/case_no/client_name/court/case_type/case_stage/legel_acts/description/filling_date/hearing_date/opposite_lawyer/total_fees/unpaid leads to sql injection. It is possible to initiate the attack remotely. The exploit has been disclosed to the public and may be used. The identifier VDB-260277 was assigned to this vulnerability.</p> <strong>Published:</strong>
                <span data-testid="vuln-published-on-6">April 11, 2024; 12:15:08 AM -0400</span>
            </td>
            <td nowrap="nowrap">

              
                

                <span id="Cvss4NAText-6" data-testid="vuln-cvss4-na-6">
                        <em>V4.0:</em>(not available)<br/>
                </span>


                
                

                <span id="Cvss3NAText-6" data-testid="vuln-cvss3-na-6">
                        <em>V3.x:</em>(not available)<br/>
                </span>

                
                


                 <span id="Cvss2NAText-6" data-testid="vuln-cvss2-na-6">
                    <em>V2.0:</em>(not available)
                 </span>
            </td>
        </tr>

        <tr data-testid="vuln-row-7">
            <th nowrap="nowrap"><strong><a href="/vuln/detail/CVE-2024-3620" data-testid="vuln-detail-link-7">CVE-2024-3620</a></strong><br/></th>
            <td>
                <p data-testid="vuln-summary-7">A vulnerability was found in SourceCodester Kortex Lite Advocate Office Management System 1.0 and classified as critical. Affected by this issue is some unknown functionality of the file /control/adds.php. The manipulation of the argument name/gender/dob/email/mobile/address leads to sql injection. The attack may be launched remotely. The exploit has been disclosed to the public and may be used. The identifier of this vulnerability is VDB-260276.</p> <strong>Published:</strong>
                <span data-testid="vuln-published-on-7">April 10, 2024; 11:15:10 PM -0400</span>
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
            <th nowrap="nowrap"><strong><a href="/vuln/detail/CVE-2024-3619" data-testid="vuln-detail-link-8">CVE-2024-3619</a></strong><br/></th>
            <td>
                <p data-testid="vuln-summary-8">A vulnerability has been found in SourceCodester Kortex Lite Advocate Office Management System 1.0 and classified as critical. Affected by this vulnerability is an unknown functionality of the file /control/addcase_stage.php. The manipulation of the argument cname leads to sql injection. The attack can be launched remotely. The exploit has been disclosed to the public and may be used. The associated identifier of this vulnerability is VDB-260275.</p> <strong>Published:</strong>
                <span data-testid="vuln-published-on-8">April 10, 2024; 11:15:10 PM -0400</span>
            </td>
            <td nowrap="nowrap">

              
                

                <span id="Cvss4NAText-8" data-testid="vuln-cvss4-na-8">
                        <em>V4.0:</em>(not available)<br/>
                </span>


                
                

                <span id="Cvss3NAText-8" data-testid="vuln-cvss3-na-8">
                        <em>V3.x:</em>(not available)<br/>
                </span>

                
                


                 <span id="Cvss2NAText-8" data-testid="vuln-cvss2-na-8">
                    <em>V2.0:</em>(not available)
                 </span>
            </td>
        </tr>

        <tr data-testid="vuln-row-9">
            <th nowrap="nowrap"><strong><a href="/vuln/detail/CVE-2024-3618" data-testid="vuln-detail-link-9">CVE-2024-3618</a></strong><br/></th>
            <td>
                <p data-testid="vuln-summary-9">A vulnerability, which was classified as critical, was found in SourceCodester Kortex Lite Advocate Office Management System 1.0. Affected is an unknown function of the file /control/activate_case.php. The manipulation of the argument id leads to sql injection. It is possible to launch the attack remotely. The exploit has been disclosed to the public and may be used. VDB-260274 is the identifier assigned to this vulnerability.</p> <strong>Published:</strong>
                <span data-testid="vuln-published-on-9">April 10, 2024; 11:15:09 PM -0400</span>
            </td>
            <td nowrap="nowrap">

              
                

                <span id="Cvss4NAText-9" data-testid="vuln-cvss4-na-9">
                        <em>V4.0:</em>(not available)<br/>
                </span>


                
                

                <span id="Cvss3NAText-9" data-testid="vuln-cvss3-na-9">
                        <em>V3.x:</em>(not available)<br/>
                </span>

                
                


                 <span id="Cvss2NAText-9" data-testid="vuln-cvss2-na-9">
                    <em>V2.0:</em>(not available)
                 </span>
            </td>
        </tr>

        <tr data-testid="vuln-row-10">
            <th nowrap="nowrap"><strong><a href="/vuln/detail/CVE-2024-3617" data-testid="vuln-detail-link-10">CVE-2024-3617</a></strong><br/></th>
            <td>
                <p data-testid="vuln-summary-10">A vulnerability, which was classified as critical, has been found in SourceCodester Kortex Lite Advocate Office Management System 1.0. This issue affects some unknown processing of the file /control/deactivate_case.php. The manipulation of the argument id leads to sql injection. The attack may be initiated remotely. The exploit has been disclosed to the public and may be used. The identifier VDB-260273 was assigned to this vulnerability.</p> <strong>Published:</strong>
                <span data-testid="vuln-published-on-10">April 10, 2024; 10:15:47 PM -0400</span>
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
            <th nowrap="nowrap"><strong><a href="/vuln/detail/CVE-2023-25493" data-testid="vuln-detail-link-11">CVE-2023-25493</a></strong><br/></th>
            <td>
                <p data-testid="vuln-summary-11">A potential vulnerability was reported in the BIOS update tool driver for some Desktop, Smart Edge, Smart Office, and ThinkStation products that could allow a local user with elevated privileges to execute arbitrary code.</p> <strong>Published:</strong>
                <span data-testid="vuln-published-on-11">April 05, 2024; 5:15:07 PM -0400</span>
            </td>
            <td nowrap="nowrap">

              
                

                <span id="Cvss4NAText-11" data-testid="vuln-cvss4-na-11">
                        <em>V4.0:</em>(not available)<br/>
                </span>


                
                <span id="cvss3-link">
                        <em>V3.1:</em>
                    <a href="/vuln-metrics/cvss/v3-calculator?name=CVE-2023-25493&amp;vector=AV:L/AC:L/PR:H/UI:N/S:U/C:H/I:H/A:H&amp;version=3.1&amp;source=Lenovo%20Group%20Ltd." class="label label-warning" data-testid="vuln-cvss3-link-11">6.7 MEDIUM</a>
                    <br/>
                </span>

                

                
                


                 <span id="Cvss2NAText-11" data-testid="vuln-cvss2-na-11">
                    <em>V2.0:</em>(not available)
                 </span>
            </td>
        </tr>

        <tr data-testid="vuln-row-12">
            <th nowrap="nowrap"><strong><a href="/vuln/detail/CVE-2024-29182" data-testid="vuln-detail-link-12">CVE-2024-29182</a></strong><br/></th>
            <td>
                <p data-testid="vuln-summary-12">Collabora Online is a collaborative online office suite based on Libr/eOffice. A stored cross-site scripting vulnerability was found in Collabora Online. An attacker could create a document with an XSS payload in document text referenced by field which, if hovered over to produce a tooltip, could be executed by the user's br/owser. Users should upgrade to Collabora Online 23.05.10.1 or higher. Earlier series of Collabora Online, 22.04, 21.11, etc. are unaffected.</p> <strong>Published:</strong>
                <span data-testid="vuln-published-on-12">April 04, 2024; 11:15:38 AM -0400</span>
            </td>
            <td nowrap="nowrap">

              
                

                <span id="Cvss4NAText-12" data-testid="vuln-cvss4-na-12">
                        <em>V4.0:</em>(not available)<br/>
                </span>


                
                

                <span id="Cvss3NAText-12" data-testid="vuln-cvss3-na-12">
                        <em>V3.x:</em>(not available)<br/>
                </span>

                
                


                 <span id="Cvss2NAText-12" data-testid="vuln-cvss2-na-12">
                    <em>V2.0:</em>(not available)
                 </span>
            </td>
        </tr>

        <tr data-testid="vuln-row-13">
            <th nowrap="nowrap"><strong><a href="/vuln/detail/CVE-2024-30265" data-testid="vuln-detail-link-13">CVE-2024-30265</a></strong><br/></th>
            <td>
                <p data-testid="vuln-summary-13">Collabora Online is a collaborative online office suite based on Libr/eOffice technology. Any deployment of voilà dashboard allow local file inclusion. Any file on a filesystem that is readable by the user that runs the voilà dashboard server can be downloaded by someone with network access to the server. Whether this still requires authentication depends on how voilà is deployed. This issue has been patched in 0.2.17, 0.3.8, 0.4.4 and 0.5.6.
</p> <strong>Published:</strong>
                <span data-testid="vuln-published-on-13">April 03, 2024; 7:15:13 PM -0400</span>
            </td>
            <td nowrap="nowrap">

              
                

                <span id="Cvss4NAText-13" data-testid="vuln-cvss4-na-13">
                        <em>V4.0:</em>(not available)<br/>
                </span>


                
                

                <span id="Cvss3NAText-13" data-testid="vuln-cvss3-na-13">
                        <em>V3.x:</em>(not available)<br/>
                </span>

                
                


                 <span id="Cvss2NAText-13" data-testid="vuln-cvss2-na-13">
                    <em>V2.0:</em>(not available)
                 </span>
            </td>
        </tr>

        <tr data-testid="vuln-row-14">
            <th nowrap="nowrap"><strong><a href="/vuln/detail/CVE-2024-24799" data-testid="vuln-detail-link-14">CVE-2024-24799</a></strong><br/></th>
            <td>
                <p data-testid="vuln-summary-14">Missing Authorization vulnerability in WooCommerce WooCommerce Box Office.This issue affects WooCommerce Box Office: from n/a through 1.2.2.

</p> <strong>Published:</strong>
                <span data-testid="vuln-published-on-14">March 26, 2024; 8:15:50 AM -0400</span>
            </td>
            <td nowrap="nowrap">

              
                

                <span id="Cvss4NAText-14" data-testid="vuln-cvss4-na-14">
                        <em>V4.0:</em>(not available)<br/>
                </span>


                
                

                <span id="Cvss3NAText-14" data-testid="vuln-cvss3-na-14">
                        <em>V3.x:</em>(not available)<br/>
                </span>

                
                


                 <span id="Cvss2NAText-14" data-testid="vuln-cvss2-na-14">
                    <em>V2.0:</em>(not available)
                 </span>
            </td>
        </tr>

        <tr data-testid="vuln-row-15">
            <th nowrap="nowrap"><strong><a href="/vuln/detail/CVE-2023-4063" data-testid="vuln-detail-link-15">CVE-2023-4063</a></strong><br/></th>
            <td>
                <p data-testid="vuln-summary-15">Certain HP OfficeJet Pro printers are potentially vulnerable to a Denial of Service when using an improper eSCL URL GET request.</p> <strong>Published:</strong>
                <span data-testid="vuln-published-on-15">March 22, 2024; 2:15:07 PM -0400</span>
            </td>
            <td nowrap="nowrap">

              
                

                <span id="Cvss4NAText-15" data-testid="vuln-cvss4-na-15">
                        <em>V4.0:</em>(not available)<br/>
                </span>


                
                

                <span id="Cvss3NAText-15" data-testid="vuln-cvss3-na-15">
                        <em>V3.x:</em>(not available)<br/>
                </span>

                
                


                 <span id="Cvss2NAText-15" data-testid="vuln-cvss2-na-15">
                    <em>V2.0:</em>(not available)
                 </span>
            </td>
        </tr>

        <tr data-testid="vuln-row-16">
            <th nowrap="nowrap"><strong><a href="/vuln/detail/CVE-2024-26199" data-testid="vuln-detail-link-16">CVE-2024-26199</a></strong><br/></th>
            <td>
                <p data-testid="vuln-summary-16">Microsoft Office Elevation of Privilege Vulnerability</p> <strong>Published:</strong>
                <span data-testid="vuln-published-on-16">March 12, 2024; 1:15:58 PM -0400</span>
            </td>
            <td nowrap="nowrap">

              
                

                <span id="Cvss4NAText-16" data-testid="vuln-cvss4-na-16">
                        <em>V4.0:</em>(not available)<br/>
                </span>


                
                <span id="cvss3-link">
                        <em>V3.1:</em>
                    <a href="/vuln-metrics/cvss/v3-calculator?name=CVE-2024-26199&amp;vector=AV:L/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H&amp;version=3.1&amp;source=Microsoft%20Corporation" class="label label-danger" data-testid="vuln-cvss3-link-16">7.8 HIGH</a>
                    <br/>
                </span>

                

                
                


                 <span id="Cvss2NAText-16" data-testid="vuln-cvss2-na-16">
                    <em>V2.0:</em>(not available)
                 </span>
            </td>
        </tr>

        <tr data-testid="vuln-row-17">
            <th nowrap="nowrap"><strong><a href="/vuln/detail/CVE-2024-25114" data-testid="vuln-detail-link-17">CVE-2024-25114</a></strong><br/></th>
            <td>
                <p data-testid="vuln-summary-17">Collabora Online is a collaborative online office suite based on Libr/eOffice technology. Each document in Collabora Online is opened by a separate "Kit" instance in a different "jail" with a unique directory "jailID" name. For security reasons, this directory name is randomly generated and should not be given out to the client. In affected versions of Collabora Online it is possible to use the CELL() function, with the "filename" argument, in the spreadsheet component to get a path which includes this JailID. The impact of this vulnerability in its own is low because it requires to be chained with another vulnerability. Users should upgrade to Collabora Online 23.05.9; Collabora Online 22.05.22; Collabora Online 21.11.10 or higher. There are no known workarounds for this vulnerability.</p> <strong>Published:</strong>
                <span data-testid="vuln-published-on-17">March 11, 2024; 6:15:54 PM -0400</span>
            </td>
            <td nowrap="nowrap">

              
                

                <span id="Cvss4NAText-17" data-testid="vuln-cvss4-na-17">
                        <em>V4.0:</em>(not available)<br/>
                </span>


                
                

                <span id="Cvss3NAText-17" data-testid="vuln-cvss3-na-17">
                        <em>V3.x:</em>(not available)<br/>
                </span>

                
                


                 <span id="Cvss2NAText-17" data-testid="vuln-cvss2-na-17">
                    <em>V2.0:</em>(not available)
                 </span>
            </td>
        </tr>

        <tr data-testid="vuln-row-18">
            <th nowrap="nowrap"><strong><a href="/vuln/detail/CVE-2024-2184" data-testid="vuln-detail-link-18">CVE-2024-2184</a></strong><br/></th>
            <td>
                <p data-testid="vuln-summary-18">Buffer overflow in identifier field of WSD probe request process of Small Office Multifunction Printers and Laser Printers(*) which may allow an attacker on the network segment to trigger the affected product being unresponsive or to execute arbitrary code.*:Satera MF740C Series/Satera MF640C Series/Satera LBP660C Series/Satera LBP620C Series firmware v12.07 and earlier, and Satera MF750C Series/Satera LBP670C Series firmware v03.09 and earlier sold in Japan.Color imageCLASS MF740C Series/Color imageCLASS MF640C Series/Color imageCLASS X MF1127C/Color imageCLASS LBP664Cdw/Color imageCLASS LBP622Cdw/Color imageCLASS X LBP1127C firmware v12.07 and earlier, and Color imageCLASS MF750C Series/Color imageCLASS X MF1333C/Color imageCLASS LBP674Cdw/Color imageCLASS X LBP1333C firmware v03.09 and earlier sold in US.i-SENSYS MF740C Series/i-SENSYS MF640C Series/C1127i Series/i-SENSYS LBP660C Series/i-SENSYS LBP620C Series/C1127P firmware v12.07 and earlier, and i-SENSYS MF750C Series/C1333i Series/i-SENSYS LBP673Cdw/C1333P firmware v03.09 and earlier sold in Europe.

</p> <strong>Published:</strong>
                <span data-testid="vuln-published-on-18">March 10, 2024; 9:15:50 PM -0400</span>
            </td>
            <td nowrap="nowrap">

              
                

                <span id="Cvss4NAText-18" data-testid="vuln-cvss4-na-18">
                        <em>V4.0:</em>(not available)<br/>
                </span>


                
                

                <span id="Cvss3NAText-18" data-testid="vuln-cvss3-na-18">
                        <em>V3.x:</em>(not available)<br/>
                </span>

                
                


                 <span id="Cvss2NAText-18" data-testid="vuln-cvss2-na-18">
                    <em>V2.0:</em>(not available)
                 </span>
            </td>
        </tr>

        <tr data-testid="vuln-row-19">
            <th nowrap="nowrap"><strong><a href="/vuln/detail/CVE-2024-22395" data-testid="vuln-detail-link-19">CVE-2024-22395</a></strong><br/></th>
            <td>
                <p data-testid="vuln-summary-19">Improper access control vulnerability has been identified in the SMA100 SSL-VPN virtual office portal, which in specific conditions could potentially enable a remote authenticated attacker to associate another user's MFA mobile application.</p> <strong>Published:</strong>
                <span data-testid="vuln-published-on-19">Febr/uary 23, 2024; 7:15:45 PM -0500</span>
            </td>
            <td nowrap="nowrap">

              
                

                <span id="Cvss4NAText-19" data-testid="vuln-cvss4-na-19">
                        <em>V4.0:</em>(not available)<br/>
                </span>


                
                

                <span id="Cvss3NAText-19" data-testid="vuln-cvss3-na-19">
                        <em>V3.x:</em>(not available)<br/>
                </span>

                
                


                 <span id="Cvss2NAText-19" data-testid="vuln-cvss2-na-19">
                    <em>V2.0:</em>(not available)
                 </span>
            </td>
        </tr>



    </tbody>
</table>




</div>
    </div>
  )
}
