import AppleHealthKit, {
  HealthKitPermissions,
  HealthValue,
  HealthActivity,
  HealthUnit,
} from 'react-native-health';
import {Platform} from 'react-native';

class AppleHealthService {
  private isInitialized: boolean = false;

  // Define permissions
  private permissions: HealthKitPermissions = {
    permissions: {
      read: [
        AppleHealthKit.Constants.Permissions.StepCount,
        AppleHealthKit.Constants.Permissions.HeartRate,
        AppleHealthKit.Constants.Permissions.SleepAnalysis,
        AppleHealthKit.Constants.Permissions.Workout,
        AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
        AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
        AppleHealthKit.Constants.Permissions.Height,
        AppleHealthKit.Constants.Permissions.Weight,
      ],
      write: [
        AppleHealthKit.Constants.Permissions.Workout,
        AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
        AppleHealthKit.Constants.Permissions.Height,
        AppleHealthKit.Constants.Permissions.Weight,
      ],
    },
  };

  // Check if HealthKit is available on the device
  async isHealthKitAvailable(): Promise<boolean> {
    if (Platform.OS !== 'ios') {
      console.warn('Apple HealthKit is only available on iOS');
      return false;
    }

    try {
      const isAvailable = await new Promise<boolean>((resolve, reject) => {
        AppleHealthKit.isAvailable((error: Object, result: boolean) => {
          if (error) {
            reject(
              new Error(`Error checking HealthKit availability: ${error}`),
            );
          } else {
            resolve(result);
          }
        });
      });
      return isAvailable;
    } catch (error) {
      console.error('Error checking HealthKit availability:', error);
      return false;
    }
  }

  // Initialize HealthKit
  async initializeHealthKit(): Promise<boolean> {
    if (!(await this.isHealthKitAvailable())) {
      console.warn('HealthKit is not available on this device');
      return false;
    }

    try {
      await new Promise<void>((resolve, reject) => {
        AppleHealthKit.initHealthKit(
          this.permissions,
          (error: string | null) => {
            if (error) {
              reject(new Error(`HealthKit initialization failed: ${error}`));
            } else {
              this.isInitialized = true;
              resolve();
            }
          },
        );
      });
      return true;
    } catch (error) {
      console.error('Error initializing HealthKit:', error);
      return false;
    }
  }

  // Check if HealthKit is initialized
  isHealthKitInitialized(): boolean {
    return this.isInitialized;
  }

  // Get step count for a specific date range
  async getStepCount(startDate: Date, endDate: Date): Promise<number | null> {
    if (!this.isInitialized) {
      throw new Error('HealthKit not initialized');
    }

    try {
      const options: {startDate: string; endDate: string} = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };

      const result = await new Promise<HealthValue>((resolve, reject) => {
        AppleHealthKit.getStepCount(
          options,
          (error: string | null, results: HealthValue) => {
            if (error) {
              reject(new Error(`Error fetching step count: ${error}`));
            } else {
              resolve(results);
            }
          },
        );
      });

      return result.value;
    } catch (error) {
      console.error('Error getting step count:', error);
      return null;
    }
  }

  // Get daily step count samples for a specific date range
  async getDailyStepCountSamples(
    startDate: Date,
    endDate: Date,
  ): Promise<HealthValue[] | null> {
    if (!this.isInitialized) {
      throw new Error('HealthKit not initialized');
    }

    try {
      const options: {startDate: string; endDate: string} = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };

      const result = await new Promise<HealthValue[]>((resolve, reject) => {
        AppleHealthKit.getDailyStepCountSamples(
          options,
          (error: string | null, results: HealthValue[]) => {
            if (error) {
              reject(
                new Error(`Error fetching daily step count samples: ${error}`),
              );
            } else {
              resolve(results);
            }
          },
        );
      });

      return result;
    } catch (error) {
      console.error('Error getting daily step count samples:', error);
      return null;
    }
  }

  // Get heart rate samples for a specific date range
  async getHeartRate(
    startDate: Date,
    endDate: Date,
  ): Promise<HealthValue[] | null> {
    if (!this.isInitialized) {
      throw new Error('HealthKit not initialized');
    }

    try {
      const options: {startDate: string; endDate: string; unit: HealthUnit} = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        unit: HealthUnit.bpm,
      };

      const result = await new Promise<HealthValue[]>((resolve, reject) => {
        AppleHealthKit.getHeartRateSamples(
          options,
          (error: string | null, results: HealthValue[]) => {
            if (error) {
              reject(new Error(`Error fetching heart rate: ${error}`));
            } else {
              resolve(results);
            }
          },
        );
      });

      return result;
    } catch (error) {
      console.error('Error getting heart rate:', error);
      return null;
    }
  }

  // Get sleep analysis for a specific date range
  async getSleepAnalysis(
    startDate: Date,
    endDate: Date,
  ): Promise<HealthValue[] | null> {
    if (!this.isInitialized) {
      throw new Error('HealthKit not initialized');
    }

    try {
      const options: {startDate: string; endDate: string} = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };

      const result = await new Promise<HealthValue[]>((resolve, reject) => {
        AppleHealthKit.getSleepSamples(
          options,
          (error: string | null, results: HealthValue[]) => {
            if (error) {
              reject(new Error(`Error fetching sleep analysis: ${error}`));
            } else {
              resolve(results);
            }
          },
        );
      });

      return result;
    } catch (error) {
      console.error('Error getting sleep analysis:', error);
      return null;
    }
  }

  // Get active energy burned for a specific date range
  async getActiveEnergyBurned(
    startDate: Date,
    endDate: Date,
  ): Promise<HealthValue[] | null> {
    if (!this.isInitialized) {
      throw new Error('HealthKit not initialized');
    }

    try {
      const options: {startDate: string; endDate: string; unit: HealthUnit} = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        unit: HealthUnit.calorie,
      };

      const result = await new Promise<HealthValue[]>((resolve, reject) => {
        AppleHealthKit.getActiveEnergyBurned(
          options,
          (error: string | null, results: HealthValue[]) => {
            if (error) {
              reject(
                new Error(`Error fetching active energy burned: ${error}`),
              );
            } else {
              resolve(results);
            }
          },
        );
      });

      return result;
    } catch (error) {
      console.error('Error getting active energy burned:', error);
      return null;
    }
  }

  // Get distance walking/running for a specific date range
  async getDistanceWalkingRunning(
    startDate: Date,
    endDate: Date,
  ): Promise<number | null> {
    if (!this.isInitialized) {
      throw new Error('HealthKit not initialized');
    }

    try {
      const options: {startDate: string; endDate: string; unit: HealthUnit} = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        unit: HealthUnit.meter,
      };

      const result = await new Promise<HealthValue>((resolve, reject) => {
        AppleHealthKit.getDistanceWalkingRunning(
          options,
          (error: string | null, results: HealthValue) => {
            if (error) {
              reject(
                new Error(`Error fetching distance walking/running: ${error}`),
              );
            } else {
              resolve(results);
            }
          },
        );
      });

      return result.value;
    } catch (error) {
      console.error('Error getting distance walking/running:', error);
      return null;
    }
  }

  // Get height
  async getHeight(): Promise<number | null> {
    if (!this.isInitialized) {
      throw new Error('HealthKit not initialized');
    }

    try {
      const options: {unit: HealthUnit} = {unit: HealthUnit.meter};

      const result = await new Promise<HealthValue>((resolve, reject) => {
        AppleHealthKit.getLatestHeight(
          options,
          (error: string | null, results: HealthValue) => {
            if (error) {
              reject(new Error(`Error fetching height: ${error}`));
            } else {
              resolve(results);
            }
          },
        );
      });

      return result.value;
    } catch (error) {
      console.error('Error getting height:', error);
      return null;
    }
  }

  // Get weight
  async getWeight(): Promise<number | null> {
    if (!this.isInitialized) {
      throw new Error('HealthKit not initialized');
    }

    try {
      const options: {unit: HealthUnit} = {unit: HealthUnit.kilocalorie};

      const result = await new Promise<HealthValue>((resolve, reject) => {
        AppleHealthKit.getLatestWeight(
          options,
          (error: string | null, results: HealthValue) => {
            if (error) {
              reject(new Error(`Error fetching weight: ${error}`));
            } else {
              resolve(results);
            }
          },
        );
      });

      return result.value;
    } catch (error) {
      console.error('Error getting weight:', error);
      return null;
    }
  }

  // Save height to HealthKit
  async saveHeight(height: number, date: Date): Promise<boolean> {
    if (!this.isInitialized) {
      throw new Error('HealthKit not initialized');
    }

    try {
      const options: {value: number; date: string; unit: HealthUnit} = {
        value: height,
        date: date.toISOString(),
        unit: HealthUnit.meter,
      };

      await new Promise<void>((resolve, reject) => {
        AppleHealthKit.saveHeight(options, (error: string | null) => {
          if (error) {
            reject(new Error(`Error saving height: ${error}`));
          } else {
            resolve();
          }
        });
      });

      return true;
    } catch (error) {
      console.error('Error saving height:', error);
      return false;
    }
  }

  // Save weight to HealthKit
  async saveWeight(weight: number, date: Date): Promise<boolean> {
    if (!this.isInitialized) {
      throw new Error('HealthKit not initialized');
    }

    try {
      const options: {value: number; date: string; unit: HealthUnit} = {
        value: weight,
        date: date.toISOString(),
        unit: HealthUnit.kilocalorie,
      };

      await new Promise<void>((resolve, reject) => {
        AppleHealthKit.saveWeight(options, (error: string | null) => {
          if (error) {
            reject(new Error(`Error saving weight: ${error}`));
          } else {
            resolve();
          }
        });
      });

      return true;
    } catch (error) {
      console.error('Error saving weight:', error);
      return false;
    }
  }

  // Save a workout to HealthKit
  async saveWorkout(
    type: HealthActivity,
    startDate: Date,
    endDate: Date,
    totalEnergyBurned: number,
    totalDistance?: number,
  ): Promise<boolean> {
    if (!this.isInitialized) {
      throw new Error('HealthKit not initialized');
    }

    try {
      const options: {
        type: HealthActivity;
        startDate: string;
        endDate: string;
        totalEnergyBurned: number;
        totalEnergyBurnedUnit: string;
        totalDistance?: number;
        totalDistanceUnit?: string;
      } = {
        type,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        totalEnergyBurned,
        totalEnergyBurnedUnit: 'calorie',
      };

      if (totalDistance !== undefined) {
        options.totalDistance = totalDistance;
        options.totalDistanceUnit = 'meter';
      }

      await new Promise<void>((resolve, reject) => {
        AppleHealthKit.saveWorkout(options, (error: string | null) => {
          if (error) {
            reject(new Error(`Error saving workout: ${error}`));
          } else {
            resolve();
          }
        });
      });

      return true;
    } catch (error) {
      console.error('Error saving workout:', error);
      return false;
    }
  }
}

export const appleHealthService = new AppleHealthService();
