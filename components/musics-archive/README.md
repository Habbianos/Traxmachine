<div align="center"><img src="./docs/img/cd.png" width="64" /></div>

# Musics Archive

Information about the songs that were created in Trax

---

## Internal musics

Inside the Traxmachine, you could save up to 50 songs, and select up to 5 of these and save in the playlist to be played when the machine is on. To save more musics, you needed to burn one disc (for each music) and/or delete them from the Trax menu.

## Music disc

The music disc was the way to keep more than 50 musics and also to share the music with others, or even sell them. They are played in the Jukebox, wich can hold up to 10 discs.

# Technical specs

Here, we have how the data was saved:

| Property | Description |
|---|---|
| id | Sequencial unique identifier number in the hotel. |
| title | String that the author's defined as the title of the song |
| author | Author's nickname |
| code | [Explained below](#music-code) |
| length | Music's duration in milliseconds |

## <a name="music-code"></a>Music code

The music code has three parts:

- **Layer id:** layer sequencial identifier, from 1 to 4 by default. There is no effect switching the layer order;
- **Sample id:** sample sequencial identifier, is not separated by the sound sets, so it's up to 648. The id `0` is used to define the empty spaces;
- **Duration:** number of spaces filled, each space represent 2 seconds. It's a multiple of the corresponding mp3 file length divided by 2 (subsequente blocks of the same sample are added together). Another way do describe is "the sample will keep playing by `duration * 2` seconds".

> The pack ids that contain the samples used in the music aren't explicit specified in the music code. So, formally there isn't a limit on how many packs could be used, just in the interface that showing them might becomes a issue.

### Formal syntax

```ebnf
<layerList> ::= <layer>+
<layer> ::= <layerId> ":" <sampleList> ":"
<layerId> ::= [1-4]
<sampleList> ::= <sample> (";" <sample>)*
<sample> ::= <sampleId> "," <duration>
<sampleId> ::= <posIntUpTo648>
<duration> ::= <positiveInteger>

<positiveInteger> ::= "0" | ([1-9] [0-9]*)
<posIntUpTo648> ::= ("64" [0-8]) | ("6" [0-3] [0-9]) | ([1-5] [0-9] [0-9]) | ([1-9] [0-9]) | [0-9]
```

> Note that by default the `<layerId>` is sequencial starting with 1 up to 4, but the number itself doesn't affect the music as having empty layers (not being sequencial) or switching the layer order (not starting with 1) doesn't change the resulting music. Having more than 4 layers and samples ids over 648 could also be possible as explained [below](#extended-version), but it's not very user-friendly allowing much more layers and those extra samples aren't grouped very well as the original packs.

### RegExp (simplified)

```regexp
/^(?:(\d+):(?:(\d+),(\d+))(;(?:(\d+),(\d+)))*:)+$/
```

### Examples

Here we have some examples, from the lasts discs that are available in the shop:

<details>
<summary>Habbowood <i>by</i> Michael Bauble</summary>

```
1:280,4;265,4;264,4;263,8;0,16:2:262,4;263,8;266,4;267,4;264,12;262,4:3:0,4;268,8;269,4;270,4;268,8;282,4;285,4:4:0,20;74,4;75,3;81,3;0,6:
```
</details>

<details>
<summary>About VIP Now <i>by</i> BanzaiBabes</summary>

```
1:152,20;146,1;0,1;152,4;151,4;152,20;153,4:2:0,8;145,12;146,1;0,1;145,4;0,1;151,2;0,1;145,20;0,1;150,2;0,1:3:0,10;150,2;146,1;0,1;150,2;146,1;0,1;150,2;146,1;0,7;151,2;0,2;150,2;146,1;0,1;150,2;146,1;0,1;150,2;0,1;146,1;0,1;146,1;0,1;146,3;0,4:4:0,4;148,2;147,2;148,2;147,2;148,2;147,2;148,2;147,2;148,4;147,2;148,6;147,2;148,2;147,2;148,2;147,2;148,2;147,2;148,2;147,2;0,4:
```
</details>

<details>
<summary>Furni Face <i>by</i> Lady BlaBla</summary>

```
1:379,4;45,4;0,1;205,2;42,5;37,4;384,2;41,4;42,5;0,2:2:0,3;199,3;0,1;383,3;519,4;515,8;519,8;39,2;0,1:3:0,2;205,2;382,4;522,2;516,12;518,8;0,3:4:0,4;386,2;0,2;43,1;0,1;207,3;202,1;520,8;44,2;0,2;520,4;207,3:
```
</details>

<details>
<summary>Gold Coin Digger <i>by</i> Kayne Quest</summary>

```
1:104,10;102,8;104,4;102,8;104,4:2:0,2;181,8;182,8;181,4;182,8;130,2;106,2:3:0,2;105,2;106,2;186,3;187,1;185,1;184,1;185,1;184,1;185,1;184,1;185,1;187,1;186,3;187,1;185,1;184,1;185,1;184,1;185,1;184,1;185,1;184,1;72,1;100,2;0,1:4:0,4;103,6;133,1;101,1;133,1;101,1;133,1;101,1;133,1;101,1;103,4;133,1;101,1;133,1;101,1;133,1;101,1;133,1;101,1;105,2;101,1;0,1:
```
</details>

<details>
<summary>I Write Bans not Tragedies <i>by</i> Pixel! at the Disco</summary>

```
1:248,4;247,4;252,4;251,8;245,4;250,4;252,4:2:359,4;250,4;359,4;345,8;0,4;359,8:3:0,3;347,1;359,4;352,8;342,4;350,4;342,4;350,4:4:0,3;357,1;334,4;246,4;343,12;334,4;340,2;0,1;347,1:
```
</details>

<details>
<summary>Haven't Friend Request You Yet <i>by</i> Michael Bauble</summary>

```
1:280,4;281,4;282,4;283,4;284,4;285,4;286,4;287,4;288,4:2:0,36:3:0,36:4:0,36:
```
</details>

<details>
<summary>Park Adventure <i>by</i> Kallomies</summary>

```
1:200,12;199,3;201,1;200,28:2:0,2;190,1;0,1;191,1;0,1;192,1;0,1;190,2;191,1;192,1;190,2;0,1;193,2;190,2;191,1;0,1;190,1;192,2;0,1;191,2;178,2;0,1;178,2;0,1;178,2;0,2;177,2;0,1;176,4:3:0,8;176,2;0,1;177,2;0,3;179,2;0,2;177,2;0,2;176,2;0,1;178,6;0,1;178,2;0,2;177,4;176,2:4:0,8;197,16;0,20:
```
</details>

<details>
<summary>Pet Romance <i>by</i> Lady BlaBla</summary>

```
1:118,1;0,1;136,2;0,2;137,2;0,2;137,2;136,2;137,2;136,4;71,6;0,4:2:121,6;122,4;123,4;122,4;123,2;122,4;0,2;169,2;0,2:3:0,1;125,1;143,8;68,2;165,2;69,1;0,1;69,1;168,1;169,2;69,1;0,1;69,1;125,1;143,4;167,1;0,1:4:0,2;120,8;138,4;120,6;138,6;66,2;121,2:
```
</details>

### Extended version

These others discs overflow the limit of 4 layers and the limit of 648 for sample id because they added more song sets for these new custom musics (why not?):

<details>
<summary>68B Attack Sub <i>by</i> Habnosis</summary>

```
1:688,32;691,32;697,36;697,2;0,2;697,8;697,3;0,1;697,28:2:0,6;687,34;0,4;688,4;0,4;687,8;688,4;695,8;696,8;695,8;696,8;0,16;687,12;0,10;97,2;689,2;0,2;688,4:3:0,15;689,2;0,7;693,4;0,3;106,2;0,8;106,4;0,1;690,2;0,8;693,4;0,2;690,2;689,2;0,12;690,2;689,2;0,10;693,4;0,22;690,2;693,8;0,4;693,4:4:0,12;693,4;129,14;0,2;129,14;0,2;129,14;698,4;0,14;129,12;129,1;0,1;129,1;0,1;129,12;129,1;0,1;129,1;0,9;129,6;0,2;129,8:5:0,44;693,4;0,12;693,4;0,20;688,4;0,2;688,4;690,2;0,7;106,2;0,6;104,7;0,11;44,2:6:0,4;50,10;0,24;700,2;104,1;0,1;104,1;0,1;104,1;0,17;694,2;0,6;698,4;0,12;698,2;689,2;0,5;106,2;0,5;698,2;689,2;0,2;694,2:7:0,8;67,4;0,18;63,2;0,26;692,2;0,2;692,16;0,2;692,36;0,4;692,8;695,4;0,4;696,8:8:0,48;695,8;696,8;0,12;693,4;0,16;699,2;0,2;699,2;0,2;699,4;0,4;699,2;0,2;699,2;0,4;699,2;0,2;699,2:meta,1;c,1
```
</details>

<details>
<summary>The Habstep <i>by</i> Habnosis</summary>

```
1:672,12;673,2;0,2;672,12;673,2;0,2;672,12;0,12;672,4;673,2;0,2;672,12;672,3;0,1;672,12;673,2;0,10;672,12;673,2;0,2;672,12;673,2:2:671,44;0,4;671,48;0,22;18,2;0,7;81,3:3:0,8;675,38;0,18;675,22;675,1;0,5;675,4;0,23;20,8;21,1;20,6;21,1:4:0,12;670,4;0,15;20,4;26,1;20,3;21,1;20,4;26,1;0,2;20,1;21,3;20,1;21,1;20,1;21,1;0,1;20,6;21,1;73,12;20,1;73,2;73,1;0,1;670,4;0,18;670,4;0,4;670,4;0,4;670,4;0,4;670,4:5:0,16;676,12;676,3;0,1;676,12;676,3;0,5;676,8;685,4;676,20;676,2;0,2;676,14;0,2;676,12;676,3;0,1;676,4;676,3;0,1;676,4;676,3:6:0,32;670,28;0,4;670,8;0,4;670,4;0,8;670,8;0,1;43,1;0,6;669,40:7:0,31;15,1;0,8;681,1;0,5;680,2;678,2;679,2;678,2;679,2;678,2;679,2;678,2;679,2;684,4;681,1;0,1;683,2;684,4;681,1;0,1;683,2;684,2;682,2;684,6;683,2;684,2;682,2;684,8;0,8;36,2;0,10;36,2;0,2;36,2;0,2;36,2:8:0,14;15,1;17,1;0,1;56,2;0,11;18,2;0,12;686,4;0,27;15,1;0,3;18,2;0,19;677,4;0,12;81,3;0,1;674,16;674,3:meta,1;c,1
```
</details>

<details>
<summary>Caliente Street <i>by</i> Barrio Bobba</summary>

```
1:163,6;0,12;214,2;0,8;490,14;490,1;0,1;490,16;0,33;261,2;313,1;0,22;654,4:2:164,4;167,1;0,1;167,1;0,1;650,16;167,1;0,1;654,12;0,2;654,2;0,2;654,14;0,2;654,12;654,3;0,1;654,4;0,4;654,12;654,3;0,1;654,4:3:0,4;658,10;0,2;658,6;0,1;429,2;0,3;658,14;658,1;0,1;658,8;0,8;658,14;0,2;658,48:4:0,8;651,2;652,2;651,2;652,2;651,2;652,2;651,2;652,2;0,8;653,1;0,3;653,1;0,1;653,1;0,3;653,1;312,1;0,15;167,1;0,8;653,1;0,18;313,1;0,11;312,1;0,20;653,1;0,2;313,1:5:0,6;313,1;261,2;0,15;163,2;0,1;168,1;0,10;429,2;0,4;651,2;652,6;651,2;652,2;651,2;652,2;651,6;652,2;651,6;652,2;0,2;652,6;0,2;651,2;652,2;651,2;652,2;651,2;652,2;651,2;0,8;652,13;167,1:6:0,12;417,4;0,4;417,24;429,2;0,28;214,2;653,1;0,5;164,2;653,1;0,7;653,1;0,7;653,1;0,6;168,1;0,8;653,1:7:0,44;650,32;649,32;0,2;214,2;0,2;214,2:8:0,48;653,1;0,11;657,16;656,32;657,3;0,1;657,3:meta,1;c,1
```
</details>

> The last part of these songs code, `meta,1;c,1`, are custom properties introduced exclusively by these musics (maybe an unreleased editor), where `meta=1` means that it has metadata (these properties), `c=1` means that it has the "cut mode" enabled (samples can have less slots than they would otherwise), and an unseen (and not implemented) property `t=<integer>` that is intended to specify the tempo (velocity) of the music.

Here is the comparasion table for all of them:

| Music                                            | Extra layers | Extra packs | Unreleased samples | Has meta |
| ------------------------------------------------ | :----------: | :---------: | :----------------: | :------: |
| **Tapes from Goa – Habnosis**                    |      ✔️     |     ✔️     |         ❎        |    ❎   |
| **Alley Cat in Trouble – Rage Against the Fuse** |      ✔️     |     ✔️     |         ❎        |    ❎   |
| **Who Dares Stacks – Rage Against the Fuse**     |      ✔️     |     ❎     |         ❎        |    ❎   |
| **Electric Pixels – Habbo de Gaia**              |      ✔️     |     ✔️     |         ❎        |    ❎   |
| **Galactic Disco – DJ Bobba feat. Habboway**     |      ✔️     |     ✔️     |         ❎        |    ❎   |
| **Epic Flail – Habbocalyptica**                  |      ✔️     |     ✔️     |         ❎        |    ❎   |
| **68B Attack Sub – Habnosis**                    |      ✔️     |     ✔️     |         ✔️        |    ✔️   |
| **The Habstep – Habnosis**                       |      ✔️     |     ✔️     |         ✔️        |    ✔️   |
| **Caliente Street – Barrio Bobba**               |      ✔️     |     ✔️     |         ✔️        |    ✔️   |
| **Habbo Libre – Ana Stan Band**                  |      ✔️     |     ❎     |         ❎        |    ✔️   |
| **Uuh Aah – DJ Bobba**                           |      ✔️     |     ✔️     |         ❎        |    ✔️   |
| **Xmas Magic – Silent Aurora**                   |      ✔️     |     ✔️     |         ❎        |    ✔️   |
