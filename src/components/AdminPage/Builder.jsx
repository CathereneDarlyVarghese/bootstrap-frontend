import { Form, FormBuilder } from "@formio/react";
import { useState } from "react";
import { Card } from "react-bootstrap";
import ReactJson from "react-json-view";
import { Helmet } from "react-helmet";
import "./styles/Builder.css";
const Builder = () => {
  const [jsonSchema, setSchema] = useState({ components: [] });
  const onFormChange = (schema) => {
    console.log("schema ==>>", schema);
    setSchema({ ...schema, components: [...schema.components] });
  };
  return (
    <div>
      <Helmet>
        <script src="https://cdn.form.io/formiojs/formio.full.min.js" />
        <link
          href="https://cdn.form.io/formiojs/formio.full.min.css"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
      </Helmet>

      <FormBuilder
        form={jsonSchema}
        onChange={(schema) => onFormChange(schema)}
      />
      {/* <ReactJson src={jsonSchema} name={null} collapsed={true}></ReactJson>
      <Form form={jsonSchema} /> */}
      <Card title="Form JSON Schema" className="my-4">
        <Card.Body>
          <Card.Title className="text-center">As JSON Schema</Card.Title>
          <ReactJson src={jsonSchema} name={null} collapsed={true}></ReactJson>
        </Card.Body>
      </Card>
      <Card className="my-4">
        <Card.Body>
          <Card.Title className="text-center">As Rendered Form</Card.Title>
          <Form form={jsonSchema} />
        </Card.Body>
      </Card>
    </div>
  );
};
export default Builder;
