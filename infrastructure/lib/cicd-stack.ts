import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as s3 from 'aws-cdk-lib/aws-s3';

export class CiCdStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3 bucket for storing build artifacts
    const artifactBucket = new s3.Bucket(this, 'ArtifactBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // CodeBuild project
    const buildProject = new codebuild.PipelineProject(this, 'BuildProject', {
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_5_0,
        computeType: codebuild.ComputeType.SMALL,
      },
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          install: {
            commands: [
              'npm install -g aws-cdk',
              'npm install -g tsc',
              'npm run cicd:install',
            ],
          },
          build: {
            commands: [
              'npm run deploy'
            ],
            dependencies: [
              'install'
            ]
          },
        },
        artifacts: {
          'base-directory': '.',
          files: '**/*',
        },
      }),
    });

    // CodePipeline
    const pipeline = new codepipeline.Pipeline(this, 'Pipeline', {
      pipelineName: 'TodoAppPipeline',
      artifactBucket: artifactBucket,
    });

    // Source stage
    const sourceOutput = new codepipeline.Artifact();
    pipeline.addStage({
      stageName: 'Source',
      actions: [
        new codepipeline_actions.GitHubSourceAction({
          actionName: 'GitHub_Source',
          owner: 'rproenza86',
          repo: 'mern-on-aws',
          oauthToken: cdk.SecretValue.secretsManager('github-token'),
          output: sourceOutput,
          branch: 'master', // or the branch you want to build from
        }),
      ],
    });

    // Build stage
    const buildOutput = new codepipeline.Artifact();
    pipeline.addStage({
      stageName: 'Build',
      actions: [
        new codepipeline_actions.CodeBuildAction({
          actionName: 'CodeBuild',
          project: buildProject,
          input: sourceOutput,
          outputs: [buildOutput],
        }),
      ],
    });

    // Deploy stage
    pipeline.addStage({
      stageName: 'Deploy',
      actions: [
        new codepipeline_actions.CloudFormationCreateUpdateStackAction({
          actionName: 'CFN_Deploy',
          templatePath: buildOutput.atPath('TodoAppStack.template.json'),
          stackName: 'RaulTodoApp',
          adminPermissions: true,
        }),
      ],
    });
  }
}