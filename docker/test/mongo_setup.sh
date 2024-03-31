#!/bin/bash
sleep 10

mongosh --host test-mongo-rs0-1:27017 <<EOF
  var cfg = {
    "_id": "testReplicaSet",
    "version": 1,
    "members": [
      {
        "_id": 0,
        "host": "test-mongo-rs0-1:27017",
        "priority": 2
      },
      {
        "_id": 1,
        "host": "test-mongo-rs0-2:27017",
        "priority": 0
      },
      {
        "_id": 2,
        "host": "test-mongo-rs0-3:27017",
        "priority": 0
      }
    ]
  };
  rs.initiate(cfg);
EOF
