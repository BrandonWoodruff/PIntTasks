# Wane Enterprises Architecture

## Executive Summary

This document outlines the design for the bi-directional integration between HubSpot and Stripe for Wane Enterprises. It will enable synchronizing data between HubSpot and Stripe, while meeting performance, scalability, reliability, and security requirements.

## Problem Statement

One of our clients, “Wane Enterprises”, needs to integrate data bi-directionally between
HubSpot and Stripe. Design an architecture that ensures seamless data flow between these
systems, handles errors, ensures data consistency, and provides details into what programming
specifications will need to be met to allow for proper operations.

## Requirements

### Performance Targets

Synced within 30 seconds
- 10k HubSpot Contacts in 1-minute bursts
- 150 Stripe Purchases in 1-minute bursts
- 100 Stripe Customers in 1-minute bursts

Limit requests:
- 15/second to HubSpot API
- 100/second to Stripe API


### HubSpot to Stripe 

- Contact Created -> Customer Created

- Contact Updated -> Customer Updated


### Stripe to HubSpot

- Customer Created -> Contact Created

- Customer Updated -> Contact Updated

- Customer Purchase -> Contact "custom event"


### Error Handling

- Robust error handling

- Built out retry methods

## Architecture Overview

We are going to use event-driven architecture with webhooks, serverless functions, and a message queue for reliability

### Components

#### HubSpot Webhook handler

Actions Triggered By:

- HubSpot Contact Creation

- Hubspot Contact Update

Actions:

- Publishes Customer Creation Job to Message Queue

- Publishes Customer Update Job to Message Queue

Communication Tools:

- Webhook Setup with Stripe

- MQTT Pub/Sub with Stripe

#### Stripe Webhook handler

Actions Triggered By: 

- Stripe Customer Creation

- Stripe Customer Update

- Stripe Purchase Event

Actions:

- Publishes Contact Creation Job to Message Queue

- Publishes Contact Update Job to Message Queue

- Publishes Custom Event Job to Message Queue

Communication Tools:

- Webhook Setup with Stripe

- MQTT Pub/Sub with Message Queue

#### Message Queue

Actions Triggered By:

- Subscribes to Webhook Messages from Stripe and HubSpot Webhook handlers

Actions:

- Buffers requests

- Enables retry, Error handling, and API rate limits

- Create Contact API Request to HubSpot Worker

- Publish Multiple Contacts Request to HubSpot Worker

- Publish Update Contact Request to HubSpot Worker

- Publish Create Custom Event Request to HubSpot Worker

- Publish Create Customer Request to Stripe Worker

- Publish Update Customer Request to Stripe Worker

Communication Tools:

- MQTT Pub/Sub

#### HubSpot Worker
Actions Triggered By:

- Subscribes to HubSpot Messages from Message Queue

Actions:

- Update Contact in HubSpot using HubSpot API

- Create Contact in HubSpot using HubSpot API

- Create Multiple Contacts using HubSpot API

- Create Custom Event using HubSpot API

- Publish Fail Response to Message Queue

Communication Tools:

- MQTT Pub/Sub

- Hubspot API

##### Special Note:
- To lighten the load on the queue, we will first attempt to create contacts using the multiple contact api. If that fails, then we can send those back to the Message Queue to resend one by one to the Worker

#### Stripe Worker
Actions Triggered By:

- Subscribes to Stripe Messages from Message Queue

Actions:

- Update Customers in Stripe using Stripe API

- Create Customer in Stripe using Stripe API

- Publish Fail Response to Message Queue

Communication Tools:

- MQTT Pub/Sub

- Stripe API


#### Data Store

- Postgres to store contact-customer mappings, logs, and queue


#### Admin Service

- basic Monitoring dashboard to view Webhook throughput, Queue size and age, Success/Failure rates, Retry attempts, and DLQ entries

- API limit updates through webapp to allow for updates on the fly



### Data Flows
- Hubspot -> HS Webhook -> Message Queue -> Stripe Worker -> Stripe

- Stripe -> Stripe Webhook -> Message Queue -> HS Worker -> HubSpot


### Security Considerations
- All API Calls with Keys and Secrets stored in cloud secrets manager

- Queue messages encrypted at rest and in transit

- Workers and services run in isolation with least privilege access to APIs and Pub/Sub Topics.

### Design Decisions


#### Event-Driven Architecture

- Ensures near real time synchronization which improves scalability and responsiveness

#### Use of MQTT Pub/Sub for Internal Communcation
- Lightweight, efficient, and supports the queuing of messages
- Reduces network overhead compared to HTTP
- Simplifies retry and logging logic
- Allows for ACL and TLS security on messages (If using Mosquitto Go Auth)

#### Webhook handlers as Stateless Serverless Functions
- Have the Webhook Handlers be able to autoscale and be cost-efficient

#### Separation of Concerns
- Simplifies Testing and QA, 
- failure Isolation
- retry handling
- supports future expansion

#### Transaction Integrity with PostGres Store
- Maintains mappings and logs without reliance on integrated systems

- Allows for robust reconciliation and traceability

#### Admin Service
- Allows for runtime updates without requiring redeployment.
- Allows for checking logs and notification of issues