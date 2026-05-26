declare module "midtrans-client" {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  type MidtransConfig = {
    isProduction: boolean;
    serverKey: string;
    clientKey?: string;
  };

  class Snap {
    constructor(config: MidtransConfig);
    createTransactionToken(transaction: unknown): Promise<string>;
    transaction: {
      status(orderId: string): Promise<unknown>;
    };
  }

  const midtransClient: {
    Snap: typeof Snap;
  };

  export default midtransClient;
}
