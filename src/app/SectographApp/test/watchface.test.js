import { WatchFace } from "../utils/WatchFace";


test("now 00:00", () => {
    let Wf = new WatchFace()
    Wf.initWatchFace(0)
    console.log(Wf.getTimePointDigits())
    expect(Wf.getTimePointDigits()).toEqual([0,1,2,3,4,5,6,7,8,9,10,23])
});

test("now 01:00", () => {
    let Wf = new WatchFace()
    Wf.initWatchFace(1)
    expect(Wf.getTimePointDigits()).toEqual([0,1,2,3,4,5,6,7,8,9,10,11])
});

test("now 02:00", () => {
    let Wf = new WatchFace()
    Wf.initWatchFace(2)
    expect(Wf.getTimePointDigits()).toEqual([12,1,2,3,4,5,6,7,8,9,10,11])
});

test("now 03:00", () => {
    let Wf = new WatchFace()
    Wf.initWatchFace(3)
    expect(Wf.getTimePointDigits()).toEqual([12,13,2,3,4,5,6,7,8,9,10,11])
});

test("now 04:00", () => {
    let Wf = new WatchFace()
    Wf.initWatchFace(4)
    expect(Wf.getTimePointDigits()).toEqual([12,13,14,3,4,5,6,7,8,9,10,11])
});

test("now 05:00", () => {
    let Wf = new WatchFace()
    Wf.initWatchFace(5)
    expect(Wf.getTimePointDigits()).toEqual([12,13,14,15,4,5,6,7,8,9,10,11])
});

test("now 06:00", () => {
    let Wf = new WatchFace()
    Wf.initWatchFace(6)
    expect(Wf.getTimePointDigits()).toEqual([12,13,14,15,16,5,6,7,8,9,10,11])
});

test("now 07:00", () => {
    let Wf = new WatchFace()
    Wf.initWatchFace(7)
    expect(Wf.getTimePointDigits()).toEqual([12,13,14,15,16,17,6,7,8,9,10,11])
});

test("now 08:00", () => {
    let Wf = new WatchFace()
    Wf.initWatchFace(8)
    expect(Wf.getTimePointDigits()).toEqual([12,13,14,15,16,17,18,7,8,9,10,11])
});

test("now 09:00", () => {
    let Wf = new WatchFace()
    Wf.initWatchFace(9)
    expect(Wf.getTimePointDigits()).toEqual([12,13,14,15,16,17,18,19,8,9,10,11])
});

test("now 10:00", () => {
    let Wf = new WatchFace()
    Wf.initWatchFace(10)
    expect(Wf.getTimePointDigits()).toEqual([12,13,14,15,16,17,18,19,20,9,10,11])
});

test("now 11:00", () => {
    let Wf = new WatchFace()
    Wf.initWatchFace(11)
    expect(Wf.getTimePointDigits()).toEqual([12,13,14,15,16,17,18,19,20,21,10,11])
});

test("now 12:00", () => {
    let Wf = new WatchFace()
    Wf.initWatchFace(12)
    expect(Wf.getTimePointDigits()).toEqual([12,13,14,15,16,17,18,19,20,21,22,11])
});

test("now 13:00", () => {
    let Wf = new WatchFace()
    Wf.initWatchFace(13)
    expect(Wf.getTimePointDigits()).toEqual([12,13,14,15,16,17,18,19,20,21,22,23])
});

test("now 14:00", () => {
    let Wf = new WatchFace()
    Wf.initWatchFace(14)
    expect(Wf.getTimePointDigits()).toEqual([0,13,14,15,16,17,18,19,20,21,22,23])
});

test("now 15:00", () => {
    let Wf = new WatchFace()
    Wf.initWatchFace(15)
    expect(Wf.getTimePointDigits()).toEqual([0,1,14,15,16,17,18,19,20,21,22,23])
});

test("now 16:00", () => {
    let Wf = new WatchFace()
    Wf.initWatchFace(16)
    expect(Wf.getTimePointDigits()).toEqual([0,1,2,15,16,17,18,19,20,21,22,23])
});

test("now 17:00", () => {
    let Wf = new WatchFace()
    Wf.initWatchFace(17)
    expect(Wf.getTimePointDigits()).toEqual([0,1,2,3,16,17,18,19,20,21,22,23])
});

test("now 18:00", () => {
    let Wf = new WatchFace()
    Wf.initWatchFace(18)
    expect(Wf.getTimePointDigits()).toEqual([0,1,2,3,4,17,18,19,20,21,22,23])
});

test("now 19:00", () => {
    let Wf = new WatchFace()
    Wf.initWatchFace(19)
    expect(Wf.getTimePointDigits()).toEqual([0,1,2,3,4,5,18,19,20,21,22,23])
});

test("now 20:00", () => {
    let Wf = new WatchFace()
    Wf.initWatchFace(20)
    expect(Wf.getTimePointDigits()).toEqual([0,1,2,3,4,5,6,19,20,21,22,23])
});

test("now 21:00", () => {
    let Wf = new WatchFace()
    Wf.initWatchFace(21)
    expect(Wf.getTimePointDigits()).toEqual([0,1,2,3,4,5,6,7,20,21,22,23])
});

test("now 22:00", () => {
    let Wf = new WatchFace()
    Wf.initWatchFace(22)
    expect(Wf.getTimePointDigits()).toEqual([0,1,2,3,4,5,6,7,8,21,22,23])
});

test("now 23:00", () => {
    let Wf = new WatchFace()
    Wf.initWatchFace(23)
    expect(Wf.getTimePointDigits()).toEqual([0,1,2,3,4,5,6,7,8,9,22,23])
});

test("now 24:00", () => {
    let Wf = new WatchFace()
    Wf.initWatchFace(24)
    expect(Wf.getTimePointDigits()).toEqual([0,1,2,3,4,5,6,7,8,9,10,23])
});

test("update 2->3", () => {
    let Wf = new WatchFace()
    Wf.initWatchFace(2)
    Wf.updateWatchFaceDigit(3)
    expect(Wf.getTimePointDigits()).toEqual([12,13,2,3,4,5,6,7,8,9,10,11])
});

test("update 3->4", () => {
    let Wf = new WatchFace()
    Wf.initWatchFace(3)
    Wf.updateWatchFaceDigit(4)
    expect(Wf.getTimePointDigits()).toEqual([12,13,14,3,4,5,6,7,8,9,10,11])
});

test("update 4->5", () => {
    let Wf = new WatchFace()
    Wf.initWatchFace(4)
    Wf.updateWatchFaceDigit(5)
    expect(Wf.getTimePointDigits()).toEqual([12,13,14,15,4,5,6,7,8,9,10,11])
});

test("update 10->11", () => {
    let Wf = new WatchFace()
    Wf.initWatchFace(10)
    Wf.updateWatchFaceDigit(11)
    expect(Wf.getTimePointDigits()).toEqual([12,13,14,15,16,17,18,19,20,21,10,11])
});

test("update 11->12", () => {
    let Wf = new WatchFace()
    Wf.initWatchFace(11)
    Wf.updateWatchFaceDigit(12)
    expect(Wf.getTimePointDigits()).toEqual([12,13,14,15,16,17,18,19,20,21,22,11])
});

test("update 12->13", () => {
    let Wf = new WatchFace()
    Wf.initWatchFace(12)
    Wf.updateWatchFaceDigit(13)
    expect(Wf.getTimePointDigits()).toEqual([12,13,14,15,16,17,18,19,20,21,22,23])
});

test("update 23->00", () => {
    let Wf = new WatchFace()
    Wf.initWatchFace(23)
    Wf.updateWatchFaceDigit(0)
    expect(Wf.getTimePointDigits()).toEqual([0,1,2,3,4,5,6,7,8,9,10,23])
});