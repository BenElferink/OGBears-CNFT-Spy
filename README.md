# OG Bears CNFT Spy

<img src='./docs/preview.png' />

<img src='./docs/preview_portfolio.png' />

This application is a free-to-use community tool for OG Bears.<br />
It is capable of following features:

1. See recently listed and recently sold Bears on CNFT.io, can be useful for "sniping".
2. Track "floor" prices for each Bear type through visualized data charts. Toggle between 7 days, and 30 days charts.
3. Create a portfolio where you can track gain/loss on your Bears, compared to floor prices.

## Folder structure

This repository is designed different than familiar practices.<br />
Just like any other React app, the `public` and `src` folders contain the code required to build the Frontend of the application.<br />
But there is a `data` folder whithin the `src`. It contains the logic for creating and maintaining data about floor prices. The bot runs on a seperate VM hosted by AWS, and keeps the data within a designated `.json` file.

## Access AWS virtual machine

1. You need to obtain a private key (`.pem` file)
2. Access the VM via SSH: `ssh -i "${FILE_NAME}.pem" ubuntu@ec2-3-22-57-176.us-east-2.compute.amazonaws.com`
3. If you need to clone the repo again for some reason, make sure to apply your GitHub token so the bot can read and write data: `git clone https://${GITHUB_TOKEN}@github.com/belferink1996/og-bears-cnft-spy.git`
4. Run `cd ./og-bears-cnft-spy/src/data`
5. Run `npm start`