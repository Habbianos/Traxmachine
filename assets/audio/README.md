# Audio Files

This folder contains three types of audio files:

1. **MP3**: currently used by the Flash and Unity client. MP3 (MPEG Audio Layer III) is a widely used audio compression format that allows for efficient storage and transmission of audio data without significant loss in quality.
2. **WAV**: used in the shockwave era. WAV (Waveform Audio File Format) is an uncompressed audio file format known for its high audio quality.
3. **RAW**: converted from WAV for ease use. RAW audio files contain raw, uncompressed audio data without any headers or additional formatting.

> Note:
> 
> 1. The MP3 version is not an exact 1:1 conversion; it exhibits some artifacts and slight shifts compared to the original WAV.
> 2. The initial 431 and 530 WAV files contained a slightly excessive number of audio frequency points, so I trimmed them to the correct length, saving to new files with the `_fixed` sufix.
