import { BreadCrumb } from "BreadCrumb";

export default function Web() {
  return (
    <div className="grid w-screen h-screen bg-gray-200 place-content-center">
      <h2>213</h2>
      <BreadCrumb separator="/">
        <BreadCrumb.Path href="../../">
          WAI-ARIA Authoring Practices
        </BreadCrumb.Path>
        <BreadCrumb.Path href="/WAI/ARIA/apg/patterns/">
          Design Patterns
        </BreadCrumb.Path>
        <BreadCrumb.Path href="/WAI/ARIA/apg/patterns/breadcrumb/">
          Breadcrumb Pattern
        </BreadCrumb.Path>
        <BreadCrumb.Path href="index.html" current>
          Breadcrumb Example
        </BreadCrumb.Path>
      </BreadCrumb>
    </div>
  );
}
