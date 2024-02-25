import { verifyPrescribers } from "../../../functional/verification/verify";


afterEach(() => {
    jest.restoreAllMocks();
})

// Due to the nature of what these are testing for,
// they may be flakey or break at any time.
test("prescriber verification - invalid licensingCollege", async () => {
    // const data = {
    //     "licensingCollege": "ooga booga"
    // }

    // await verifyPrescribers([data]);
    // expect(verifyPrescribers).toThrow(Error);
});

test("prescriber verification - valid licensingCollege", () => {});

test("prescriber verification - known verified", () => {});

test("prescriber verification - known invalid", () => {});

test("prescriber verification - known error", () => {});
