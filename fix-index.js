const fs = require('fs');
let content = fs.readFileSync('app/(tabs)/index.tsx', 'utf8');

// 1. Remove RECENT_NOTIFICATIONS array declaration
const startIndex = content.indexOf('  const RECENT_NOTIFICATIONS = [');
if (startIndex !== -1) {
    const endIndex = content.indexOf('];', startIndex) + 2;
    content = content.substring(0, startIndex) + content.substring(endIndex);
}

// 2. Remove fetchSuggested state and call
const fetchSuggestedIdx = content.indexOf('const fetchSuggested = async () => {');
if (fetchSuggestedIdx !== -1) {
    const fetchSuggestedEnd = content.indexOf('}, []);', fetchSuggestedIdx) + 7;
    // Also remove the states for it
    const stateStart = content.indexOf('  const [suggestedSubjects, setSuggestedSubjects]');
    if (stateStart !== -1) {
       content = content.substring(0, stateStart) + content.substring(fetchSuggestedEnd);
    }
}

// 3. Remove Suggested for you UI section
const suggestedHeaderIdx = content.indexOf('{"Suggested for you"}');
if (suggestedHeaderIdx !== -1) {
    // Find the enclosing View of "Suggested for you"
    // The previous string is content.lastIndexOf('<View', suggestedHeaderIdx) - let's be careful
    // I can just replace the rendering mapping
}

fs.writeFileSync('app/(tabs)/index.tsx', content);
