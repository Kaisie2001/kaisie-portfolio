# Active rain ambience: user-provided recording

Original: /Users/apple/Downloads/mixkit-rain-in-the-jungle-and-birds-2431.wav
Original format: stereo, 44100 Hz, 24-bit PCM, 30.170975 seconds.
Active asset: public/robotaxi-opening/rain-recording-loop.wav
Derived format: stereo, 44100 Hz, 16-bit PCM, 28.970975 seconds.
Original PCM SHA-256: 282cf10730559275b2d7ad8e3cad339ecc5f77347d9a2abd5f94e08634bd388e

Derived only from the uploaded recording. No synthesized noise is mixed in. Applied a gentle one-pole 6.5 kHz high-frequency smoothing filter and a 1.2-second wrap crossfade. No gain boost, denoising, time stretching or bird removal. Original left untouched. Recording title mentions jungle and birds: suitability for an urban rainy night requires human audition; no claim that birds were removed.

Playback uses this local file, one HTMLAudioElement per mounted scene, volume 0.15 after 1.2-second fade-in following explicit user activation. Muting fades out over 220 ms. Hidden/pagehide/unmount immediately stop playback. Visual Replay does not remount the atmosphere or audio. Hidden page returns muted, requiring explicit activation. HTML media looping uses the prepared wrap crossfade, but hardware/browser loop gaps remain to be auditioned. Reduced motion changes visuals only.

Source supplied by user; Mixkit appears in filename. No independent license verification or changed licensing claim is made. Earlier synthesized rain-ambience.wav is no longer referenced by the component.

Checks: TypeScript passed; mocked player lifecycle tests passed (default mute, duplicate click prevention, mute fade/pause, visibility, pagehide, cleanup). Actual browser playback, perceptual volume, birds, loop boundary and mobile policies NOT yet verified. Local socket listen returns EPERM; Chromium startup is blocked by MachPort permission. No real recording/screenshot of the new visual has been produced.


Phase8A-2 lifecycle update: the same local recording now belongs to rainAudio.ts, one lazy shared HTMLAudioElement across client navigation. Gallery may preload it silently; play is requested in the original card click, respecting persisted mute. Direct entry remains silent. Handoff fade-in is650ms, volume0.15; mute fade is220ms. Last scene release, visibility and pagehide stop sound. Visual Replay leaves audio untouched. The recording bytes remain unchanged. Browser-level sound timing and device volume behavior remain unverified; see delivery/PHASE8A-2-QA.md.

Phase8A-3: a case-transition lease now holds the same player across Opening unmount while its snapshot bridge is visible. Volume follows ripple/destination dissolve progress and stops on completion/cancel. No recording bytes or preference values are changed by this fade; no new player/play/load is created by exit. See delivery/PHASE8A-3-QA.md for verification limits.
