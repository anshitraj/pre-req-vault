import { Connection, PublicKey } from "@solana/web3.js";

const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const user = new PublicKey("5U8V4sH2W8z6yknRUeSscVr3eY1Le4JSq1rPWXHGJ3pc");
const applicationProgram = new PublicKey("TRBZyQHB3m68FGeVsqTK39Wm4xejadjVhP5MAZaKWDM");

const [applicationAccount] = PublicKey.findProgramAddressSync(
  [Buffer.from("prereqs"), user.toBuffer()],
  applicationProgram
);

console.log("ApplicationAccount PDA:", applicationAccount.toBase58());

const info = await connection.getAccountInfo(applicationAccount);
if (!info) {
  console.log("Account does not exist.");
  process.exit(1);
}

const data = info.data;
let offset = 8; // anchor discriminator
const userPubkey = new PublicKey(data.subarray(offset, offset + 32));
offset += 32;
const bump = data.readUInt8(offset);
offset += 1;
const preReqTs = data.readUInt8(offset) === 1;
offset += 1;
const preReqRs = data.readUInt8(offset) === 1;
offset += 1;
const githubLen = data.readUInt32LE(offset);
offset += 4;
const github = data.subarray(offset, offset + githubLen).toString("utf8");

console.log("owner:", info.owner.toBase58());
console.log("user:", userPubkey.toBase58());
console.log("bump:", bump);
console.log("pre_req_ts:", preReqTs);
console.log("pre_req_rs:", preReqRs);
console.log("github:", github);
