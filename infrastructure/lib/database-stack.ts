import * as cdk from 'aws-cdk-lib';
import { aws_dynamodb as dynamodb } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class DataBaseConstruct extends Construct {
    public readonly todoTable: dynamodb.Table;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        // DynamoDB Table for TODOs
        const todoTable = new dynamodb.Table(this, 'TodoTable', {
            tableName: 'Todos',
            partitionKey: { name: 'TodoID', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'CreatedAt', type: dynamodb.AttributeType.STRING },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,  // Use on-demand pricing
            removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code!
        });
        this.todoTable = todoTable;

        // Optionally, add a GSI for querying by Status
        todoTable.addGlobalSecondaryIndex({
            indexName: 'StatusIndex',
            partitionKey: { name: 'Status', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'CreatedAt', type: dynamodb.AttributeType.STRING },
            projectionType: dynamodb.ProjectionType.ALL,
        });

        // Output the table name
        new cdk.CfnOutput(this, 'TableName', {
            value: todoTable.tableName
        });
    }
}
