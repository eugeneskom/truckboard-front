# UI 
## Start with login, redirects to the dashboard
- Agent can add a carrier (agent_id Foreign key)
- When carrier is created, agent can click on truck`s icon on the Carriers page
## Extended table shows 2 forms: 
- First to add a new truck Truck entity (carrier_id Foreign key). When truck is created it will .
- Second form is Driver entity (carrier_id & truck_id Foreign keyS).
- Below the froms, a list of trucks and drivers are rendered; 
Driver can be created only if spare truck exists.