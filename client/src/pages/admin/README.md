# Prescriber Verification Known Issues
- For prescriber verification, only a single instance of running scrapers can be done (ie. there can't be two calls to run the scrapers as I think the later call will override the first)
- There is no way to cancel an existing verification call, but making another call will implicitly stop the previous one
- Possibly undefined behaviour when there is concurrently 2 users, where one is admin running verification, and other may be a prescriber/patient. Do not know if running verification blocks other actions.
---
- This all can technically be solved if we do things with task queues (running each scraper job async) as well as having a dedicated worker instance for each scraper, but clearly time is the issue.