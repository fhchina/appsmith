const commonlocators = require("../../../../locators/commonlocators.json");
const formWidgetsPage = require("../../../../locators/FormWidgets.json");
const widgetLocators = require("../../../../locators/Widgets.json");
const publish = require("../../../../locators/publishWidgetspage.json");
const dsl = require("../../../../fixtures/multiSelectDsl.json");
const pages = require("../../../../locators/Pages.json");
const data = require("../../../../fixtures/example.json");

describe("MultiSelect Widget Functionality", function() {
  before(() => {
    cy.addDsl(dsl);
  });
  beforeEach(() => {
    cy.wait(7000);
  });
  it("Selects value with invalid default value", () => {
    cy.openPropertyPane("multiselectwidgetv2");
    cy.testJsontext("options", JSON.stringify(data.input));
    cy.testJsontext("defaultvalue", "{{ undefined }}");
    cy.get(formWidgetsPage.multiselectwidgetv2)
      .find(".rc-select-selection-search-input")
      .first()
      .focus({ force: true })
      .type("{uparrow}", { force: true });
    cy.get(".multi-select-dropdown")
      .contains("Option 3")
      .click({ force: true });
    cy.wait(2000);
    //Validating option inside multiselect widget
    cy.get(".rc-select-selection-item-content")
      .first()
      .should("have.text", "Option 3");
  });
  it("Selects value with enter in default value", () => {
    cy.testJsontext(
      "defaultvalue",
      '[\n  {\n    "label": "Option 3",\n    "value": "3"\n  }\n]',
    );
    cy.get(formWidgetsPage.multiselectwidgetv2)
      .find(".rc-select-selection-item-content")
      .first()
      .should("have.text", "Option 3");
  });
  it("Dropdown Functionality To Validate Options", function() {
    cy.get(".rc-select-selector").click({ force: true });
    cy.dropdownMultiSelectDynamic("Option 2");
  });
  it("Dropdown Functionality To Unchecked Visible Widget", function() {
    cy.togglebarDisable(commonlocators.visibleCheckbox);
    cy.PublishtheApp();
    cy.get(publish.multiselectwidgetv2 + " " + ".rc-select-selector").should(
      "not.exist",
    );
    cy.get(publish.backToEditor).click();
  });
  it("Dropdown Functionality To Check Visible Widget", function() {
    cy.openPropertyPane("multiselectwidgetv2");
    cy.togglebar(commonlocators.visibleCheckbox);
    cy.PublishtheApp();
    cy.get(publish.multiselectwidgetv2 + " " + ".rc-select-selector").should(
      "be.visible",
    );
    cy.get(publish.backToEditor).click();
  });
  it("Dropdown Functionality To Check Allow select all option", function() {
    // select all option is not enable
    cy.get(formWidgetsPage.multiselectwidgetv2)
      .find(".rc-select-selection-item-content")
      .first()
      .should("not.have.text", "Select all");
    // enable select all option from property pane
    cy.openPropertyPane("multiselectwidgetv2");
    cy.togglebar(commonlocators.allowSelectAllCheckbox);

    // press select all option
    cy.get(formWidgetsPage.multiselectwidgetv2)
      .find(".rc-select-selection-search-input")
      .first()
      .focus({ force: true })
      .type("{uparrow}", { force: true });
    cy.get(".multi-select-dropdown")
      .contains("Select all")
      .click({ force: true });
    cy.wait(2000);
    //Validating option inside multiselect widget
    cy.get(".rc-select-selection-item-content")
      .eq(0)
      .should("have.text", "Option 1");
    cy.get(".rc-select-selection-item-content")
      .eq(1)
      .should("have.text", "Option 2");
  });

  describe("Label section", () => {
    it("Check properties: Text, Position, Alignment, Width", () => {
      const widgetName = "multiselectwidgetv2";
      const labelText = "Label";
      const parentColumnSpace = 10.87890625;
      const widgetSelector = `.t--widget-${widgetName}`;
      const labelSelector = `${widgetSelector} label.tree-multiselect-label`;
      const containerSelector = `${widgetSelector} [class*="MultiSelectContainer"]`;
      const labelPositionSelector = ".t--property-control-position button";
      const labelAlignmentSelector = ".t--property-control-alignment button";
      const labelWidthSelector =
        ".t--property-control-width .CodeMirror textarea";

      cy.openPropertyPane(widgetName);

      cy.get(".t--property-control-text .CodeMirror textarea")
        .first()
        .focus()
        .type(labelText);
      // Assert label presence
      cy.get(labelSelector)
        .first()
        .contains(labelText);
      // Assert label position: Auto
      cy.get(containerSelector).should("have.css", "flex-direction", "column");

      // Change label position to Top
      cy.get(labelPositionSelector)
        .eq(1)
        .click();
      // Assert label position: Top
      cy.get(containerSelector).should("have.css", "flex-direction", "column");

      // Change label position to Left
      cy.get(labelPositionSelector)
        .eq(2)
        .click();
      // Assert label position: Left
      cy.get(containerSelector).should("have.css", "flex-direction", "row");
      // Set label alignment to RIGHT
      cy.get(labelAlignmentSelector)
        .eq(1)
        .click();
      // Assert label alignment
      cy.get(labelSelector)
        .first()
        .should("have.css", "text-align", "right");
      // Set label width to 4 cols
      cy.get(labelWidthSelector)
        .first()
        .focus()
        .type("4");
      cy.wait(300);
      // Assert label width
      cy.get(labelSelector)
        .first()
        .should("have.css", "width", `${parentColumnSpace * 4}px`);
    });
  });
});
afterEach(() => {
  // put your clean up code if any
});
