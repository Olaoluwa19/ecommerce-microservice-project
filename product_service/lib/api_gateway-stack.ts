import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

interface ApiGatewayStackProps {
  productService: IFunction;
}

export class ApiGatewayStack extends Construct {
  constructor(scope: Construct, id: string, props: ApiGatewayStackProps) {
    super(scope, id);
    this.addResource("product", props.productService);
  }

  addResource(serviceName: string, handler: IFunction) {
    const apgw = new LambdaRestApi(this, `${serviceName}-ApiGtw`, {
      restApiName: `${serviceName}-Service`,
      handler,
      proxy: false,
    });

    const productResource = apgw.root.addResource("product");
    productResource.addMethod("GET"); // GET /product
    productResource.addMethod("POST"); // POST /product

    const productIdResource = productResource.addResource("{id}");
    productIdResource.addMethod("GET"); // GET /product/{id}
    productIdResource.addMethod("PUT"); // PUT /product/{id}
    productIdResource.addMethod("DELETE"); // DELETE /product/{id}

    const categoryResource = apgw.root.addResource("category");
    categoryResource.addMethod("GET"); // GET /category
    categoryResource.addMethod("POST"); // POST /category

    const categoryIdResource = categoryResource.addResource("{id}");
    categoryIdResource.addMethod("GET"); // GET /category/{id}
    categoryIdResource.addMethod("PUT"); // PUT /category/{id}
    categoryIdResource.addMethod("DELETE"); // DELETE /category/{id}

    const dealsResource = apgw.root.addResource("deals");
    dealsResource.addMethod("GET"); // GET /deals
    dealsResource.addMethod("POST"); // POST /deals

    const dealsIdResource = dealsResource.addResource("{id}");
    dealsIdResource.addMethod("GET"); // GET /deals/{id}
    dealsIdResource.addMethod("PUT"); // PUT /deals/{id}
    dealsIdResource.addMethod("DELETE"); // DELETE /deals/{id}
  }
}
