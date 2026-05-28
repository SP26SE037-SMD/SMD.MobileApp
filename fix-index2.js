const fs = require('fs');
let content = fs.readFileSync('app/(tabs)/index.tsx', 'utf8');

// 1. Remove the suggested layout part entirely
const suggestHeaderIdx = content.indexOf('<View\n            style={{\n              flexDirection: "row",\n              justifyContent: "space-between",');
const exploreSectionIdx = content.indexOf('          <Text\n            style={{\n              fontSize: 18,\n              fontWeight: "700",\n              color: colors.textPrimary,\n              marginBottom: 16,\n              letterSpacing: -0.3,\n            }}\n          >\n            {"Explore"}\n          </Text>');
console.log("suggestHeaderIdx", suggestHeaderIdx);
console.log("exploreSectionIdx", exploreSectionIdx);
if (suggestHeaderIdx !== -1 && exploreSectionIdx !== -1) {
   content = content.substring(0, suggestHeaderIdx) + content.substring(exploreSectionIdx);
}

// 2. Modify limit for notification popup (change slice(0, 5) to slice(0, 3))
content = content.replace(/slice\(0, 5\)/g, 'slice(0, 3)');


fs.writeFileSync('app/(tabs)/index.tsx', content);
