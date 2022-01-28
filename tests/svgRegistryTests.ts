import { SvgIconRegistry } from "../src/svgbundle";
export default QUnit.module("SvgRegistryTests");

QUnit.test("svg import from raw symbol", function (assert) {
  let svg = new SvgIconRegistry();
  svg.registerIconFromSymbol("a", "<symbol id=\"icon-a\"><circle/></symbol>");
  svg.registerIconFromSymbol("b", "<symbol id=\"icon-b\"><line/></symbol>");

  assert.equal(svg.iconsRenderedHtml(), "<symbol id=\"icon-a\"><circle/></symbol><symbol id=\"icon-b\"><line/></symbol>");
});

QUnit.test("svg import from svg via element", function (assert) {
  let svg = new SvgIconRegistry();
  svg.registerIconFromSvgViaElement("a", "<svg viewBox=\"0 0 100 100\"><circle/></symbol>");
  assert.equal(svg.iconsRenderedHtml(), "<symbol viewbox=\"0 0 100 100\" id=\"icon-a\"><circle></circle></symbol>");
});

QUnit.test("svg import from svg via string", function (assert) {
  let svg = new SvgIconRegistry();
  let res = svg.registerIconFromSvg("a", "<svg viewBox=\"0 0 100 100\"><circle/></svg>");
  assert.ok(res);
  assert.equal(svg.iconsRenderedHtml(), "<symbol id=\"icon-a\" viewbox=\"0 0 100 100\"><circle/></symbol>");
});

QUnit.test("svg import custom prefix via element", function (assert) {
  let svg = new SvgIconRegistry();
  svg.registerIconFromSvgViaElement("a", "<svg viewBox=\"0 0 100 100\"><circle/></svg>", "sprite-");
  assert.equal(svg.iconsRenderedHtml(), "<symbol viewbox=\"0 0 100 100\" id=\"sprite-a\"><circle></circle></symbol>");
});

QUnit.test("svg import custom prefix via string", function (assert) {
  let svg = new SvgIconRegistry();
  let res = svg.registerIconFromSvg("a", "<svg viewBox=\"0 0 100 100\"><circle/></svg>", "sprite-");
  assert.ok(res);
  assert.equal(svg.iconsRenderedHtml(), "<symbol id=\"sprite-a\" viewbox=\"0 0 100 100\"><circle/></symbol>");
});