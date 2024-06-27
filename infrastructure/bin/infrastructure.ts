#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { TodoAppStack } from '../lib/infrastructure-stack';  
import { CiCdStack } from '../lib/cicd-stack';

const app = new cdk.App();

new TodoAppStack(app, 'RaulTodoApp');
new CiCdStack(app, 'RaulTodoAppCiCd');