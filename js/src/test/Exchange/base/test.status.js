function testStatus(exchange, skippedProperties, method, entry, now) {
    const format = {
        'info': {},
        'status': 'ok',
        'updated': 1650000000000,
        'eta': 1660000000000,
        'url': 'https://example.com', // a link to a Git
    };
    // todo: after status object is changed in base
    // if (exchange.has['fetchStatus'] && exchange.has['fetchTime']) {
    //     const emptyAllowedFor = [ 'url', 'eta', 'updated' ];
    //     testSharedMethods.assertStructure (exchange, skippedProperties, method, entry, format, emptyAllowedFor);
    //     //
    //     testSharedMethods.assertInArray (exchange, skippedProperties, method, entry, 'status', [ 'ok', 'error', 'shutdown', 'maintenance' ]);
    //     testSharedMethods.assertGreater (exchange, skippedProperties, method, entry, 'updated', '0');
    //     testSharedMethods.assertGreater (exchange, skippedProperties, method, entry, 'eta', '0');
    //     testSharedMethods.assertGreater (exchange, skippedProperties, method, entry, 'eta', now.toString ());
    // } else {
    //     const emptyAllowedFor = [ 'status', 'url', 'eta', 'updated', 'info' ];
    //     testSharedMethods.assertStructure (exchange, skippedProperties, method, entry, format, emptyAllowedFor);
    //     for (let i = 0; i < emptyAllowedFor.length; i++) {
    //         const key = emptyAllowedFor[i];
    //         assert (entry[key] === undefined, 'key "' + key + '" should be undefined when exchange does not have any status-related methods');
    //     }
    // }
}
export default testStatus;
