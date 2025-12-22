import express from 'express';
import NodeCache from 'node-cache';
import { validateCoordinates } from '../utils/validation.js';

const router = express.Router();
const cache = new NodeCache({ stdTTL: 300 }); // 5 minutes cache

/**
 * GET /api/risk/zones
 * Get risk zones with weather and traffic integration
 */
router.get('/zones', async (req, res) => {
  try {
    const { lat, lng, radius = 5000 } = req.query;
    
    if (lat && lng) {
      const validation = validateCoordinates({ lat: parseFloat(lat), lng: parseFloat(lng) });
      if (validation.error) {
        return res.status(400).json({ error: validation.error.details[0].message });
      }
    }

    const cacheKey = `risk_zones_${lat || 'all'}_${lng || 'all'}_${radius}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ ...cached, cached: true });
    }

    // Mock risk zones with enhanced data
    const riskZones = [
      {
        id: 1,
        name: 'Downtown Intersection',
        coordinates: { lat: 40.7589, lng: -73.9851 },
        risk: 'high',
        riskScore: 85,
        accidents: 23,
        description: 'High traffic intersection with poor visibility during rain',
        factors: {
          traffic: { level: 'heavy', score: 90 },
          weather: { condition: 'rain', impact: 80 },
          infrastructure: { quality: 'poor', score: 70 },
          lighting: { quality: 'poor', score: 60 },
          visibility: { level: 'low', score: 50 }
        },
        weatherImpact: {
          rain: 85,
          snow: 90,
          fog: 95,
          clear: 60
        },
        trafficPatterns: {
          morning: 95,
          afternoon: 85,
          evening: 90,
          night: 40
        },
        lastUpdate: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        recommendations: [
          'Install additional traffic lights',
          'Improve street lighting',
          'Add weather-responsive signage'
        ]
      },
      {
        id: 2,
        name: 'Highway 101 Exit',
        coordinates: { lat: 40.7505, lng: -73.9934 },
        risk: 'medium',
        riskScore: 65,
        accidents: 12,
        description: 'Construction zone with frequent lane changes',
        factors: {
          traffic: { level: 'moderate', score: 70 },
          weather: { condition: 'clear', impact: 30 },
          infrastructure: { quality: 'construction', score: 80 },
          lighting: { quality: 'good', score: 85 },
          visibility: { level: 'good', score: 80 }
        },
        weatherImpact: {
          rain: 75,
          snow: 85,
          fog: 70,
          clear: 50
        },
        trafficPatterns: {
          morning: 80,
          afternoon: 70,
          evening: 75,
          night: 30
        },
        lastUpdate: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        recommendations: [
          'Improve construction zone signage',
          'Add merge warning systems',
          'Implement speed monitoring'
        ]
      },
      {
        id: 3,
        name: 'School District Area',
        coordinates: { lat: 40.7614, lng: -73.9776 },
        risk: 'low',
        riskScore: 25,
        accidents: 3,
        description: 'Residential area with effective traffic calming measures',
        factors: {
          traffic: { level: 'light', score: 30 },
          weather: { condition: 'clear', impact: 20 },
          infrastructure: { quality: 'excellent', score: 95 },
          lighting: { quality: 'excellent', score: 90 },
          visibility: { level: 'excellent', score: 95 }
        },
        weatherImpact: {
          rain: 35,
          snow: 45,
          fog: 40,
          clear: 20
        },
        trafficPatterns: {
          morning: 40,
          afternoon: 45,
          evening: 35,
          night: 15
        },
        lastUpdate: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
        recommendations: [
          'Maintain current safety measures',
          'Regular crosswalk maintenance',
          'Continue speed monitoring'
        ]
      },
      {
        id: 4,
        name: 'Shopping Mall Entrance',
        coordinates: { lat: 40.7282, lng: -73.9942 },
        risk: 'high',
        riskScore: 78,
        accidents: 18,
        description: 'Busy commercial area with complex traffic patterns',
        factors: {
          traffic: { level: 'heavy', score: 85 },
          weather: { condition: 'clear', impact: 40 },
          infrastructure: { quality: 'fair', score: 60 },
          lighting: { quality: 'good', score: 75 },
          visibility: { level: 'moderate', score: 65 }
        },
        weatherImpact: {
          rain: 85,
          snow: 90,
          fog: 80,
          clear: 65
        },
        trafficPatterns: {
          morning: 70,
          afternoon: 90,
          evening: 95,
          night: 45
        },
        lastUpdate: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
        recommendations: [
          'Redesign parking lot entrances',
          'Add pedestrian crossing signals',
          'Implement traffic flow optimization'
        ]
      },
      {
        id: 5,
        name: 'Bridge Approach',
        coordinates: { lat: 40.7831, lng: -73.9712 },
        risk: 'medium',
        riskScore: 55,
        accidents: 8,
        description: 'Bridge entrance susceptible to weather conditions',
        factors: {
          traffic: { level: 'moderate', score: 60 },
          weather: { condition: 'windy', impact: 70 },
          infrastructure: { quality: 'good', score: 80 },
          lighting: { quality: 'good', score: 80 },
          visibility: { level: 'variable', score: 60 }
        },
        weatherImpact: {
          rain: 70,
          snow: 85,
          fog: 90,
          clear: 40
        },
        trafficPatterns: {
          morning: 75,
          afternoon: 65,
          evening: 70,
          night: 25
        },
        lastUpdate: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
        recommendations: [
          'Install wind speed monitoring',
          'Add weather warning systems',
          'Improve bridge lighting'
        ]
      }
    ];

    // Filter by location if coordinates provided
    let filteredZones = riskZones;
    if (lat && lng) {
      const centerLat = parseFloat(lat);
      const centerLng = parseFloat(lng);
      const radiusKm = parseInt(radius) / 1000;

      filteredZones = riskZones.filter(zone => {
        const distance = calculateDistance(
          centerLat, centerLng,
          zone.coordinates.lat, zone.coordinates.lng
        );
        return distance <= radiusKm;
      });
    }

    const result = {
      zones: filteredZones,
      summary: {
        total: filteredZones.length,
        highRisk: filteredZones.filter(z => z.risk === 'high').length,
        mediumRisk: filteredZones.filter(z => z.risk === 'medium').length,
        lowRisk: filteredZones.filter(z => z.risk === 'low').length,
        averageRiskScore: filteredZones.reduce((sum, z) => sum + z.riskScore, 0) / filteredZones.length || 0
      },
      timestamp: new Date().toISOString()
    };

    cache.set(cacheKey, result);
    res.json(result);
  } catch (error) {
    console.error('Risk zones error:', error);
    res.status(500).json({ error: 'Failed to fetch risk zones' });
  }
});

/**
 * POST /api/risk/analyze
 * Analyze risk for specific coordinates with weather and traffic data
 */
router.post('/analyze', async (req, res) => {
  try {
    const { coordinates, weatherData, trafficData, timeOfDay, factors } = req.body;
    
    if (!coordinates || !coordinates.lat || !coordinates.lng) {
      return res.status(400).json({ error: 'Coordinates are required' });
    }

    const validation = validateCoordinates(coordinates);
    if (validation.error) {
      return res.status(400).json({ error: validation.error.details[0].message });
    }

    // Calculate risk score based on multiple factors
    let riskScore = 0;
    const riskFactors = {};

    // Weather impact (0-40 points)
    if (weatherData) {
      let weatherScore = 0;
      if (weatherData.condition) {
        const weatherImpacts = {
          'clear': 5,
          'clouds': 10,
          'rain': 25,
          'snow': 35,
          'fog': 30,
          'thunderstorm': 40
        };
        weatherScore = weatherImpacts[weatherData.condition.toLowerCase()] || 15;
      }
      if (weatherData.windSpeed > 15) weatherScore += 10;
      if (weatherData.visibility < 1000) weatherScore += 15;
      
      riskScore += Math.min(weatherScore, 40);
      riskFactors.weather = { score: weatherScore, impact: 'high' };
    }

    // Traffic impact (0-30 points)
    if (trafficData) {
      let trafficScore = 0;
      if (trafficData.congestionLevel) {
        const trafficImpacts = {
          'light': 5,
          'moderate': 15,
          'heavy': 25,
          'severe': 30
        };
        trafficScore = trafficImpacts[trafficData.congestionLevel.toLowerCase()] || 10;
      }
      
      riskScore += trafficScore;
      riskFactors.traffic = { score: trafficScore, level: trafficData.congestionLevel };
    }

    // Time of day impact (0-20 points)
    if (timeOfDay) {
      const timeImpacts = {
        'morning': 15, // Rush hour
        'afternoon': 10,
        'evening': 18, // Peak rush hour
        'night': 25    // Reduced visibility
      };
      const timeScore = timeImpacts[timeOfDay.toLowerCase()] || 10;
      riskScore += timeScore;
      riskFactors.timeOfDay = { score: timeScore, period: timeOfDay };
    }

    // Additional factors (0-10 points)
    if (factors) {
      let additionalScore = 0;
      if (factors.construction) additionalScore += 5;
      if (factors.schoolZone) additionalScore -= 3; // Safer due to speed limits
      if (factors.hospitalNearby) additionalScore += 2; // More emergency vehicles
      if (factors.shoppingArea) additionalScore += 4; // More pedestrians
      
      riskScore += Math.max(0, Math.min(additionalScore, 10));
      riskFactors.additional = { score: additionalScore, factors };
    }

    // Determine risk level
    let riskLevel;
    if (riskScore >= 70) riskLevel = 'high';
    else if (riskScore >= 40) riskLevel = 'medium';
    else riskLevel = 'low';

    // Generate recommendations
    const recommendations = generateRecommendations(riskScore, riskFactors);

    const analysis = {
      coordinates,
      riskScore: Math.min(riskScore, 100),
      riskLevel,
      riskFactors,
      recommendations,
      confidence: calculateConfidence(weatherData, trafficData, factors),
      timestamp: new Date().toISOString()
    };

    res.json(analysis);
  } catch (error) {
    console.error('Risk analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze risk' });
  }
});

/**
 * GET /api/risk/predictions
 * Get risk predictions for the next few hours
 */
router.get('/predictions', async (req, res) => {
  try {
    const { lat, lng, hours = 6 } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ 
        error: 'Latitude and longitude parameters are required' 
      });
    }

    const validation = validateCoordinates({ lat: parseFloat(lat), lng: parseFloat(lng) });
    if (validation.error) {
      return res.status(400).json({ error: validation.error.details[0].message });
    }

    const cacheKey = `predictions_${lat}_${lng}_${hours}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ ...cached, cached: true });
    }

    // Generate predictions for the next N hours
    const predictions = [];
    const now = new Date();
    
    for (let i = 1; i <= parseInt(hours); i++) {
      const predictionTime = new Date(now.getTime() + i * 60 * 60 * 1000);
      const hour = predictionTime.getHours();
      
      // Simulate varying risk based on time patterns
      let baseRisk = 30;
      if (hour >= 7 && hour <= 9) baseRisk = 70; // Morning rush
      else if (hour >= 17 && hour <= 19) baseRisk = 80; // Evening rush
      else if (hour >= 22 || hour <= 5) baseRisk = 45; // Night time
      
      // Add some randomness for weather/traffic variations
      const variation = (Math.random() - 0.5) * 20;
      const riskScore = Math.max(0, Math.min(100, baseRisk + variation));
      
      let riskLevel;
      if (riskScore >= 70) riskLevel = 'high';
      else if (riskScore >= 40) riskLevel = 'medium';
      else riskLevel = 'low';

      predictions.push({
        time: predictionTime.toISOString(),
        riskScore: Math.round(riskScore),
        riskLevel,
        factors: {
          traffic: hour >= 7 && hour <= 9 || hour >= 17 && hour <= 19 ? 'heavy' : 'moderate',
          weather: 'clear', // Would integrate with weather forecast
          visibility: hour >= 22 || hour <= 6 ? 'reduced' : 'good'
        }
      });
    }

    const result = {
      location: { lat: parseFloat(lat), lng: parseFloat(lng) },
      predictions,
      summary: {
        averageRisk: predictions.reduce((sum, p) => sum + p.riskScore, 0) / predictions.length,
        peakRiskTime: predictions.reduce((max, p) => p.riskScore > max.riskScore ? p : max),
        safestTime: predictions.reduce((min, p) => p.riskScore < min.riskScore ? p : min)
      },
      timestamp: new Date().toISOString()
    };

    cache.set(cacheKey, result);
    res.json(result);
  } catch (error) {
    console.error('Risk predictions error:', error);
    res.status(500).json({ error: 'Failed to generate risk predictions' });
  }
});

// Helper functions
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function generateRecommendations(riskScore, riskFactors) {
  const recommendations = [];
  
  if (riskScore >= 70) {
    recommendations.push('Avoid this area if possible');
    recommendations.push('Use alternative routes');
  }
  
  if (riskFactors.weather?.score > 20) {
    recommendations.push('Reduce speed due to weather conditions');
    recommendations.push('Increase following distance');
  }
  
  if (riskFactors.traffic?.score > 20) {
    recommendations.push('Expect delays and heavy traffic');
    recommendations.push('Consider using public transportation');
  }
  
  if (riskFactors.timeOfDay?.score > 15) {
    recommendations.push('Exercise extra caution during peak hours');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Normal driving conditions expected');
  }
  
  return recommendations;
}

function calculateConfidence(weatherData, trafficData, factors) {
  let confidence = 50; // Base confidence
  
  if (weatherData) confidence += 20;
  if (trafficData) confidence += 20;
  if (factors) confidence += 10;
  
  return Math.min(confidence, 95);
}

export default router;