export const config = {
autoSaveInterval: 5000,
sessionTimeout: 30 * 60 * 1000,
criticalThresholds: {
ich: { high: 60, critical: 80 },
lvo: { high: 50, critical: 70 }
},
gfapRanges: { min: 29, max: 10001, normal: 100, elevated: 500, critical: 1000 }
};