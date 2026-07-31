import { Inngest } from "inngest";

export const INNGEST_CLIENT = 'INNGEST_CLIENT';

export const inngest = new Inngest({
  id: "pipeline-studio-bs",
  isDev: process.env.NODE_ENV !== 'production',
});

export const helloWorld = inngest.createFunction(
  { id: "hello-world", triggers: [{ event: "test/hello.world" }] },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);

export const functions = [
  helloWorld
];
