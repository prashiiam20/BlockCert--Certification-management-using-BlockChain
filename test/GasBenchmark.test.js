const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Gas Benchmark Report", function () {
  let registry, owner, institution, student;

  beforeEach(async function () {
    [owner, institution, student] = await ethers.getSigners();
    const CertificateRegistry = await ethers.getContractFactory("CertificateRegistry");
    registry = await CertificateRegistry.deploy();
    await registry.waitForDeployment();
    await registry.grantRole(institution.address, 3);
    await registry.grantRole(student.address, 4);
  });

  it("Gas: Deploy CertificateRegistry", async function () {
    const Factory = await ethers.getContractFactory("CertificateRegistry");
    const tx = await Factory.deploy();
    const receipt = await tx.deploymentTransaction().wait();
    console.log("  DEPLOY GAS:", receipt.gasUsed.toString());
  });

  it("Gas: grantRole", async function () {
    const [, , , extra] = await ethers.getSigners();
    const tx = await registry.grantRole(extra.address, 3);
    const receipt = await tx.wait();
    console.log("  GRANT_ROLE GAS:", receipt.gasUsed.toString());
  });

  it("Gas: issueCertificate", async function () {
    const tx = await registry.connect(institution).issueCertificate(
      "QmWATWQ7fVPP2EFGu71UkfnqhYXDYH566qy7Sdr3GYVS5e",
      ethers.keccak256(ethers.toUtf8Bytes("test-cert-hash")),
      student.address,
      0
    );
    const receipt = await tx.wait();
    console.log("  ISSUE_CERTIFICATE GAS:", receipt.gasUsed.toString());
  });

  it("Gas: revokeCertificate", async function () {
    const tx1 = await registry.connect(institution).issueCertificate(
      "QmTest",
      ethers.keccak256(ethers.toUtf8Bytes("test-revoke")),
      student.address,
      0
    );
    const r1 = await tx1.wait();
    const certId = r1.logs[0].topics[1];

    const tx2 = await registry.connect(institution).revokeCertificate(certId);
    const receipt = await tx2.wait();
    console.log("  REVOKE_CERTIFICATE GAS:", receipt.gasUsed.toString());
  });



  it("Gas: getCertificate (view — zero gas)", async function () {
    const tx = await registry.connect(institution).issueCertificate(
      "QmVerifyTest",
      ethers.keccak256(ethers.toUtf8Bytes("test-verify")),
      student.address,
      0
    );
    const r = await tx.wait();
    const certId = r.logs[0].topics[1];

    // View functions cost 0 on-chain gas
    const cert = await registry.getCertificate(certId);
    console.log("  VERIFY/GET GAS: 0 (view function)");
    console.log("  Certificate IPFS CID:", cert.ipfsCID);
  });
});
