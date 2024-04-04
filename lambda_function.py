import json
import boto3


TABLE = 'example-plot-data'


def lambda_handler(event, context):
    dynamodb = boto3.resource("dynamodb")
    table = dynamodb.Table(TABLE)

    # Define the partition key and its value
    partition_key = 'PK'
    partition_key_value = 'NVDA'

    # Query the table for items with the given partition key
    response = table.query(
        KeyConditionExpression=f'{partition_key} = :partitionkeyval',
        ExpressionAttributeValues={':partitionkeyval': partition_key_value}
    )

    out = {'x': [], 'y': []}

    for item in response['Items']:
        out['x'].append(item['SK'])
        out['y'].append(float(item['Close']))

    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET'
        },
        'body': json.dumps(out)
    }
