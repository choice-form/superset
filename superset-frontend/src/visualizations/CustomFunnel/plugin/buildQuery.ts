/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * unless required by applicable law or agreed to in writing,
 * software distributed under the license is distributed on an
 * "as is" basis, without warranties or conditions of any
 * kind, either express or implied.  see the license for the
 * specific language governing permissions and limitations
 * under the license.
 */
import { buildQueryContext, QueryFormData } from 'src/core';

export default function buildquery(formdata: QueryFormData) {
  const { cols: groupby } = formdata;
  return buildQueryContext(formdata, basequeryobject => [
    { ...basequeryobject, groupby },
  ]);
}
