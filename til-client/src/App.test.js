import React from "react";
import { mount, shallow } from "enzyme";
import App from "./App";

describe("Using the App", () => {
  it("Renders without crashing", () => {
    const app = shallow(<App />);
    expect(app).toMatchSnapshot();
  });
  const app = mount(<App />);
  it("Renders Form Component", () => {
    expect(app.find("Form").exists()).toBeTruthy();
  });
  it("Form has title, author, body inputs", () => {
    const form = app.find("Form");
    expect(form.find("input[id='title']").exists()).toBeTruthy();
    expect(form.find("input[id='author']").exists()).toBeTruthy();
    expect(form.find("textarea[id='body']").exists()).toBeTruthy();
  });
  afterAll(() => {
    app.unmount();
  });
});

// expect(app.find("Entry").exists()).toBeTruthy();
