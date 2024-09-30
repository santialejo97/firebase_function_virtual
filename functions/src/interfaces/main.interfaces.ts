export interface Message {
  subject: string;
  body: string;
  sender?: { name: string; email: string };
  to: [{ name: string; email: string }];
}
