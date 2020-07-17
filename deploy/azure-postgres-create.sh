#!/bin/bash

# northeurope
# Create a resource group
az group create \
--name EyalAzranDev \
--location northeurope \
--tags Application=db Environment=dev


# Create a PostgreSQL server in the resource group
# Name of a server maps to DNS name and is thus required to be globally unique in Azure.
# Substitute the <server_admin_password> with your own value.
az postgres server create \
--name postgres \
--resource-group EyalAzranDev \
--location northeurope \
--admin-user postgres \
--admin-password aA123456 \
--sku-name Standard_B2ms \

# Configure a firewall rule for the server
# The ip address range that you want to allow to access your server
az postgres server firewall-rule create \
--resource-group EyalAzranDev \
--server postgres \
--name AllowIps \
--start-ip-address 0.0.0.0 \
--end-ip-address 255.255.255.255