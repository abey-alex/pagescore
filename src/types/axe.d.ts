declare module 'axe-core' {
  interface Result {
    id: string;
    impact: string;
    description: string;
    help: string;
    helpUrl: string;
    nodes: Array<{
      html: string;
      target: string[];
      failureSummary: string;
    }>;
  }

  interface Results {
    violations: Result[];
    passes: Result[];
    incomplete: Result[];
    inapplicable: Result[];
  }

  function run(): Promise<Results>;
  function run(context?: any, options?: any): Promise<Results>;
} 