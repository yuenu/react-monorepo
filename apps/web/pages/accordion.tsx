import { Accordion } from "Accordion";

export default function Web() {
  return (
    <div className="grid w-screen h-screen bg-gray-200 place-content-center">
      <Accordion>
        <Accordion.Item >
          <Accordion.Header className="p-4 bg-blue-400 border-b-2">Personal Information</Accordion.Header>
          <Accordion.Panel className="bg-red-400 ">test content</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item>
          <Accordion.Header className="p-4 bg-blue-400 ">Billing Address</Accordion.Header>
          <Accordion.Panel className="bg-red-400">test content 2</Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}
