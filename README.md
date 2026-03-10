# Productivity App

A React Native productivity app for managing tasks, goals, and rewards — built with Expo SDK 54 and TypeScript.

## Tech Stack

- **Framework**: React Native + Expo SDK 54
- **Language**: TypeScript
- **Navigation**: React Navigation v6 (Bottom Tabs + Native Stack)
- **State Management**: Zustand
- **Database**: expo-sqlite
- **Storage**: @react-native-async-storage/async-storage
- **Animations**: react-native-reanimated + react-native-gesture-handler
- **Charts**: react-native-gifted-charts
- **Date Utils**: date-fns
- **Notifications**: expo-notifications
- **Haptics**: expo-haptics

## Screens

| Screen   | Description                                      |
|----------|--------------------------------------------------|
| Tasks    | Daily task list with weekly calendar strip       |
| Goals    | Weekly goals with progress tracking              |
| Rewards  | Unlockable rewards linked to goal completion     |
| Stats    | Weekly performance metrics and activity trend    |
| Settings | Notifications, goals, and rewards management     |

## Setup

```bash
# Install dependencies
npm install

# Start development server
npx expo start
```

## Testing on iPhone

1. Install [Expo Go](https://apps.apple.com/app/expo-go/id982107779) from the App Store
2. Run `npx expo start` on your machine
3. Scan the QR code with your iPhone camera

## Branch Strategy

- `main` — stable/release only
- `develop` — integration branch
- `feature/[name]` — one branch per phase/feature
