from nvd_api import NvdApiClient
from pprint import pprint

# Create an instance of NvdApiClient
client = NvdApiClient()

# Fetch CPE match for the specified CVE
response = client.get_cves(
    cpe_name="cpe:2.3:a:winscp:winscp:5.19.2:*:*:*:*:*:*:*",
)
# Print the response in a readable format
pprint(response)