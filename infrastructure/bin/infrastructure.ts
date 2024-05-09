#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { TodoAppStack } from '../lib/infrastructure-stack';  // Adjust the import according to your stack file's name and location

const app = new cdk.App();
new TodoAppStack(app, 'RaulTodoApp');
