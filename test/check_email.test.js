var expect = require("chai").expect;
var sinon = require("sinon");
var httpMocks = require("node-mocks-http");
var checkEmail = require("../middlewares/check_email");

describe("email check middleware", function () {
  it("should return 400", function () {
    var nextSpy = sinon.spy();
    const mockReq = httpMocks.createRequest();
    const mockRes = httpMocks.createResponse();
    checkEmail(mockReq, mockRes, nextSpy);
    expect(mockRes.statusCode).to.equal(400);
  });
  it("should return 400", function () {
    var nextSpy = sinon.spy();
    const mockReq = httpMocks.createRequest({
      headers: {
        "x-user": "test@gmail.",
      },
    });
    const mockRes = httpMocks.createResponse();
    checkEmail(mockReq, mockRes, nextSpy);
    expect(mockRes.statusCode).to.equal(400);
  });
  it("should return 200", function () {
    var nextSpy = sinon.spy();
    const mockReq = httpMocks.createRequest({
      headers: {
        "x-user": "test@gmail.com",
      },
    });
    const mockRes = httpMocks.createResponse();
    checkEmail(mockReq, mockRes, nextSpy);
    expect(mockRes.statusCode).to.equal(200);
  });
});
