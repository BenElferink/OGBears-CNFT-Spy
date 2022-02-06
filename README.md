# OGBears CNFT Spy

<img src='./docs/preview.png' />

<img src='./docs/preview_portfolio.png' />

## Introduction

This application is a free-to-use community tool for OGBears (Cardano NFT)!<br />
It is capable of following features:

1. See recently listed and recently sold Bears from [cnft.io](https://cnft.io) and [jpg.store](https://jpg.store), can be useful for "sniping" and locating trends.
2. Track "floor" prices for each Bear type through visualized data charts. Toggle between 7 days, and 30 days charts.
3. Create a portfolio where you can track gain/loss on your Bears, compared to floor prices.

## Public API

GET current (live) floor prices - for Bears:
```
https://ogbears.vercel.app/api/floor
```

GET current (live) floor prices - for Salmon Trophy:
```
https://ogbears.vercel.app/api/floor/salmon
```

GET listed items on [cnft.io](https://cnft.io):
```
https://ogbears.vercel.app/api/listings/cnft
```

GET sold items from [cnft.io](https://cnft.io):
```
https://ogbears.vercel.app/api/listings/cnft?sold=true
```

GET listed items on [jpg.store](https://jpg.store):
```
https://ogbears.vercel.app/api/listings/jpg
```

GET sold items from [jpg.store](https://jpg.store):
```
https://ogbears.vercel.app/api/listings/jpg?sold=true
```

## Access AWS virtual machine

1. You need to obtain a private key (`.pem` file)
2. Access the VM via SSH: `ssh -i "${FILE_NAME}.pem" ubuntu@ec2-3-22-57-176.us-east-2.compute.amazonaws.com`
3. If you need to clone the repo again for some reason, make sure to apply your GitHub token so the bot can read and write data: `git clone https://${GITHUB_TOKEN}@github.com/belferink1996/og-bears-cnft-spy.git`
4. Run `cd ./og-bears-cnft-spy`
5. Run `npm run floor-bot`

