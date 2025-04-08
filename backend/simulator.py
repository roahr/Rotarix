import random
import time
from datetime import datetime, timedelta
import pandas as pd
from faker import Faker
from rotarix_anomaly_detector import AnomalyMonitor  # Assuming we use the previous detector

# Initialize
fake = Faker()
monitor = AnomalyMonitor(model_path='models/')

# ======================
# 1. Log Generator Engine
# ======================
class ThreatScenarioSimulator:
    def __init__(self):
        self.base_log = {
            "timestamp": "",
            "source_ip": "",
            "user": "",
            "event_type": "",
            "message": "",
            "failed_attempts": 0,
            "success_attempts": 0,
            "latency_ms": 0,
            "geolocation_risk": 0.1,
            "privilege_level": 0
        }
        
    def _generate_normal_log(self):
        """Baseline non-threat activity"""
        log = self.base_log.copy()
        log.update({
            "timestamp": datetime.utcnow().isoformat(),
            "source_ip": fake.ipv4(),
            "user": fake.user_name(),
            "event_type": random.choice(["login", "api_call", "file_access"]),
            "message": random.choice([
                "Successful login",
                "API request processed",
                "File read operation"
            ]),
            "success_attempts": 1,
            "latency_ms": random.randint(50, 300),
            "privilege_level": random.choice([0, 1])
        })
        return log
    
    def generate_attack_log(self, scenario):
        """Generate logs for specific threat scenarios"""
        log = self._generate_normal_log()
        
        if scenario == "brute_force":
            log.update({
                "event_type": "login",
                "message": "Multiple failed login attempts",
                "failed_attempts": random.randint(5, 15),
                "success_attempts": 0,
                "source_ip": "192.168.1." + str(random.randint(100, 200)),
                "geolocation_risk": 0.8
            })
        
        elif scenario == "geo_anomaly":
            log.update({
                "event_type": "login",
                "message": "Login from unusual location",
                "geolocation_risk": 0.95,
                "source_ip": random.choice(["54.240.203.1", "182.162.34.78"]),
                "latency_ms": random.randint(800, 1500)
            })
        
        elif scenario == "privilege_escalation":
            log.update({
                "event_type": "auth",
                "message": "Unauthorized privilege change",
                "privilege_level": 2,
                "geolocation_risk": 0.7
            })
        
        return log

# ======================
# 2. Experiment Runner
# ======================
def run_simulation():
    simulator = ThreatScenarioSimulator()
    scenarios = ["normal"]*5 + ["brute_force", "geo_anomaly", "privilege_escalation"]
    results = []
    
    print("🚀 Starting Rotarix Security Simulation")
    print("="*50)
    
    for i in range(100):  # Generate 100 logs
        # Randomly select scenario with 15% attack probability
        scenario = random.choices(
            ["normal", "brute_force", "geo_anomaly", "privilege_escalation"],
            weights=[0.85, 0.05, 0.05, 0.05]
        )[0]
        
        # Generate log
        log = [simulator.generate_attack_log(scenario)] if scenario != "normal" else [simulator._generate_normal_log()]
        
        # Process through Rotarix
        analysis = monitor.ingest_logs(log)
        
        # Record results
        results.append({
            **log[0],
            "actual_scenario": scenario,
            "risk_score": analysis["risk_score"],
            "action": analysis["action"],
            "detected_threat": analysis["risk_score"] > 0.85
        })
        
        # Print critical events
        if analysis["risk_score"] > 0.7:
            print(f"⚠️ [{log[0]['timestamp']}] {log[0]['message']}")
            print(f"   Risk: {analysis['risk_score']:.2f} → Action: {analysis['action'].upper()}")
            print(f"   Top Factors: {analysis['top_features']}")
            print("-"*50)
        
        time.sleep(0.1)  # Simulate real-time delay
    
    # Save results
    pd.DataFrame(results).to_csv("simulation_results.csv", index=False)
    print("✅ Simulation complete. Results saved to simulation_results.csv")

# ======================
# 3. Analysis Utilities
# ======================
def analyze_results():
    df = pd.read_csv("simulation_results.csv")
    
    # Calculate detection metrics
    attacks = df[df["actual_scenario"] != "normal"]
    detected = attacks[attacks["detected_threat"]]
    
    print("\n🔍 Simulation Analysis")
    print("="*50)
    print(f"Total Logs: {len(df)}")
    print(f"Attack Logs: {len(attacks)}")
    print(f"Detected Attacks: {len(detected)}")
    print(f"Detection Rate: {len(detected)/len(attacks):.1%}")
    
    # False positives
    fp = df[(df["actual_scenario"] == "normal") & (df["detected_threat"])]
    print(f"\nFalse Positives: {len(fp)} ({len(fp)/len(df):.1%})")
    
    # Scenario breakdown
    print("\nBy Attack Type:")
    for scenario in ["brute_force", "geo_anomaly", "privilege_escalation"]:
        subset = attacks[attacks["actual_scenario"] == scenario]
        detected_subset = subset[subset["detected_threat"]]
        print(f"  {scenario.replace('_',' ').title()}: {len(detected_subset)}/{len(subset)} detected")

if __name__ == "__main__":
    run_simulation()
    analyze_results()