# Process
If there is more than 1 person with the same first/last name when scraping and license number is not used, then we assume the first person is used. (Checking if there is multiple is do-able but requires a lot more computation to go through all results and possibly paginate. This likely is not a worthy tradeoff.)

# Known limitations
- PE and NB scrapers are request limited if approximately over 4 requests in a minute.