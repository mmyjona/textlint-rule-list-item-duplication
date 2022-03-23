const crypto = require("crypto");
export default function (context, options = {}) {
  const { Syntax, RuleError, report, getSource } = context;
  const itemHashSet = new Set();
  let parentHash = "";
  return {
    [Syntax.ListItem](node) {
      // "Str" node
      const text = getSource(node); // Get text
      const trimListText = node.raw
        .replace("* ", "")
        .replace("- ", "")
        .replace(/\d+\./, "")
        .trim();
      const trimListTextParent = node.parent.raw
        .replace("* ", "")
        .replace("- ", "")
        .replace(/\d+\./, "")
        .trim();
      // console.log(node);
      // console.log(node.parent);
      const nodeHash = crypto
        .createHash("md5")
        .update(trimListText)
        .digest("hex");
      console.log("node hash: " + nodeHash);
      const nodeHashParent = crypto
        .createHash("md5")
        .update(trimListTextParent)
        .digest("hex");
      console.log("node parent hash: " + nodeHashParent);
      if (parentHash === "" || parentHash !== nodeHashParent) {
        console.log("clear!");
        itemHashSet.clear();
        parentHash = nodeHashParent;
      }
      if (itemHashSet.has(nodeHash)) {
        const indexOfBugs = node.index;
        const ruleError = new RuleError("发现重复列表项", {
          index: indexOfBugs, // padding of index
        });
        report(node, ruleError);
      } else {
        itemHashSet.add(nodeHash);
      }
    },
  };
}
