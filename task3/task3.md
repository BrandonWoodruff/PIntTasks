Interview Task 3

Your Task
Analyze the provided problem statement and requirements and put together an architecture
document. The provided document should give an overview of the solution and what pieces of
architecture will need to be set up and what they will do to fulfill the problem statement.
Additionally, provide reasoning for any important technical decisions and consider security,
scalability, and monitoring requirements.
Problem Statement
One of our clients, “Wane Enterprises”, needs to integrate data bi-directionally between
HubSpot and Stripe. Design an architecture that ensures seamless data flow between these
systems, handles errors, ensures data consistency, and provides details into what programming
specifications will need to be met to allow for proper operations.
Requirements
● Data Synchronization:
○ Whenever a Contact is created inside HubSpot, create a customer inside Stripe.
○ Whenever a Customer is created inside Stripe, create a contact inside HubSpot.
○ When a contact’s details are updated in HubSpot (Email, First Name, Last Name,
Phone Number), update the details of the corresponding customer in Stripe.
○ When a customer’s details are updated in Stripe (Email, First Name, Last Name,
Phone Number), update the details of the corresponding contact in HubSpot.
○ When a customer makes a purchase in Stripe, log this as a “custom event” in the
corresponding HubSpot contact.
● Performance and Scalability:
○ HubSpot contacts are created and updated at an average rate of 1000/day, with
bursts of up to 10,000 in one minute during occasional large scale imports.
○ Stripe customers are created at a rate of 1000/day, with peak hours seeing up to
100 contacts per minute.
○ Stripe customer updates occur at a rate of about 10/day.
○ Stripe purchases are made at a rate of about 10,000/day, with peak hours seeing
up to 150 purchases per minute.
● Error Handling and Consistency:
○ Implement robust error handling and retry mechanisms.
○ Ensure data consistency and address potential eventual consistency issues.
● Real Time Data Flow:
○ The customer wants data in either system to be visible in the other as fast as
possible, we have promised the customer that any change in either system will
be visible in the other in under 30 seconds at all times.

Assumptions
● Assume both HubSpot and Stripe have reasonable webhooks for the above events that
contain all needed information.
● Both Stripe and HubSpot send over only one event at a time via webhook.
● Assume Stripe has a general API rate limit of 100/second
● Assume HubSpot has a general API rate limit of 15/second
● Assume Stripe has a straight forward API for searching for, updating, and creating a
single customer.
● Assume HubSpot has a straight forward API for searching for, updating, and creating a
single contact.
● Assume HubSpot has a straight forward API for searching for, updating, and creating a
batch of up to 100 contacts.
○ If one contact has an error (For example let's assume HubSpot does not allow
contacts to be created with an invalid email or phone number but stripe does, the
entire batch of 100 fails with no good error reporting)

● Assume HubSpot has a straight forward API for creating a single “custom event” on a
contact.
Available Infrastructure pieces
● We have access to both listed webhooks above
● We have access to both listed APIs above
● We have access to setting up any number of serverless functions
● We have access to any number of VPSs
● Additionally we have access to any other commonly available features that a cloud
provider might offer